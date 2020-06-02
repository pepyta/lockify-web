import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

require("dotenv").config();

export default async function (req, res) {
    try {
        if(req.method === "POST"){
            let { body } = req;
            body = JSON.parse(body);
            let loginToken = await prisma.loginToken.findOne({
                where: {
                    token: body['token']
                }
            });
    
            if(loginToken === null){
                res.json({
                    error: false,
                    message: "There was no user with this login token."
                });
            }
    
            
            await prisma.loginToken.delete({
                where: {
                    token: body['token']
                }
            });
    
            res.json({
                error: false,
                message: "You have successfully logged out."
            });
        }
    } catch(error) {
        console.log(error);
        res.json({
            error: true,
            errorMessage: "Something went wrong"
        });
    }
}