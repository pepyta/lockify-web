import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

require("dotenv").config();

export default async function (req, res) {
    try {
        if (req.method === 'POST') {
            let { body } = req;
            body = JSON.parse(body);

            const loginToken = await prisma.loginToken.findMany({
                where: {
                    token: body['token']
                }
            });

            const user = await prisma.user.findMany({
                where: {
                    id: loginToken[0]['userId']
                }
            });

            if(user === null){
                res.json({
                    error: true,
                    errorMessage: "Please login first!"
                });
            }

            res.json({
                error: false,
                data: {
                    providers: await prisma.provider.findMany({
                        where: {
                            NOT: [{
                                image: ""
                            }]
                        }
                    })
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