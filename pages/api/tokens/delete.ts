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

            let token = await prisma.token.findOne({
                where: {
                    id: body['token']
                }
            });

            if(token == null){
                res.json({
                    error: true,
                    errorMessage: "Token not found"
                });
                return;
            }

            if(token.userId !== loginToken.userId){
                res.json({
                    error: true,
                    errorMessage: "This token doesn't belong to you"
                });
            }

            await prisma.token.delete({
                where: {
                    id: token.id
                }
            });

            res.json({
                error: false,
                message: "Successfully deleted!"
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