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

            let tokens = await prisma.token.findMany({
                where: {
                    userId: user[0]['id']
                }
            });

            for(let index in tokens){
                let token = tokens[index];
                let provider = await prisma.provider.findOne({
                    where: {
                        id: token.providerId
                    }
                });
                token['provider'] = provider;
            }

            res.json({
                error: false,
                data: {
                    tokens: tokens
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