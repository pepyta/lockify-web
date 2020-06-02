import { PrismaClient } from '@prisma/client';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

require("dotenv").config();

export default async function (req, res) {
	try {
		if (req.method === 'POST') {
			let { body } = req;
			body = JSON.parse(body);

			try {
				body['password'] = await bcrypt.hash(body['password'], 10);

				let user = await prisma.user.create({
					data: {
						name: body['name'],
						username: body['username'],
						email: body['email'],
						password: body['password'],
						image: ""
					}
				});

				delete user['password'];

				let userId = user['id'];
				let generatedToken = jwt.sign({
					user,
					loginTime: Date.now()
				}, process.env.SECRET_FOR_TOKEN_GENERATION);
				let device = body['device'];

				let token = await prisma.loginToken.create({
					data: {
						token: generatedToken,
						device: device,
						user: {
							connect: {
								id: userId
							}
						}
					}
				});

				res.json({
					error: false,
					data: {
						user,
						token
					}
				});
			} catch (err) {
				console.log(err);
				res.json({
					error: true,
					errorMessage: "Username or email already taken."
				});
			}
		}
	} catch {
		res.json({
			error: true,
			errorMessage: "Something went wrong"
		});
	}
}