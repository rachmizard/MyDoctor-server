/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jwtSign = (payload) => {
	try {
		return jwt.sign(payload, process.env.JWT_TOKEN, {
			expiresIn: process.env.JWT_EXPIRED_TIME * process.env.JWT_EXPIRED_TIME,
		});
	} catch (error) {
		throw new Error(error.message);
	}
};

export const jwtVerify = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_TOKEN);
	} catch (error) {
		throw new Error(error.message);
	}
};
