import { PrismaClient, User } from '@prisma/client';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

require("dotenv").config();

export default async function (req, res) {
	if (req.method === 'POST') {
		let { body } = req;
		body = JSON.parse(body);

		try {
            let checkReCaptcha = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${body['reCaptchaToken']}`, {
                method: "POST"
            });

            let data = await checkReCaptcha.json();

            if(!data['success']){
                res.json({
                    error: true,
                    errorMessage: "ReCaptcha verification failed.",
                    data
                });
                return;
            }

            let user:User | null = null;
            if(body['username']){
                user = await prisma.user.findOne({
                    where: {
                        username: body['username']
                    }
                });
            } else if(body['email']){
                user = await prisma.user.findOne({
                    where: {
                        email: body['email']
                    }
                });
            }

            if(user === null){
                res.json({
                    error: true,
                    errorMessage: "No user found with that username"
                });
                return;
            }

            const passwordMatch = await bcrypt.compare(body['password'], user.password);
            delete user['password'];
            if(!passwordMatch){
                res.json({
                    error: true,
                    errorMessage: "Invalid password"
                });
            }

			let generatedToken = jwt.sign({
				user,
				loginTime: Date.now()
            }, process.env.SECRET_FOR_TOKEN_GENERATION);
            
            const loginToken = await prisma.loginToken.create({
                data: {
                    token: generatedToken,
                    device: body['device'],
                    user: {
                        connect: {
                            id: user['id']
                        }
                    }
                }
            });

            res.json({
                error: false,
                data: {
                    user,
                    loginToken
                }
            });
		} catch(err) {
			console.log(err);
			res.json({
				error: true,
				errorMessage: "Username or email already taken."
			});
		}
	}
}