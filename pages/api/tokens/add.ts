import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

require("dotenv").config();

export default async function (req, res) {
    try {
        if (req.method === 'POST') {
            let { body } = req;
            body = JSON.parse(body);

            const loginToken = await prisma.loginToken.findOne({
                where: {
                    token: body['loginToken']
                }
            });

            if(loginToken === null){
                res.json({
                    error: true,
                    errorMessage: "Invalid login token"
                });
                return;
            }

            const user = await prisma.user.findMany({
                where: {
                    id: loginToken['userId']
                }
            });

            let provider = await prisma.provider.findOne({
                where: {
                    name: body['provider']
                }
            });

            if(provider === null){
                provider = await prisma.provider.create({
                    data: {
                        name: body['provider'],
                        image: ""
                    }
                });
            }

            const token = await prisma.token.create({
                data: {
                    token: body['token'],
                    username: body['username'],
                    user: {
                        connect: {
                            id: user[0].id
                        }
                    },
                    provider: {
                        connect: {
                            id: provider.id
                        }
                    }

                }
            });

            res.json({
                error: false,
                message: "Successfully added!",
                data: {
                    token: {
                        id: token.id,
                        provider: provider,
                        token: body['token'],
                        username: body['username']
                    }
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            error: true,
            errorMessage: "Something went wrong"
        })
    }
}