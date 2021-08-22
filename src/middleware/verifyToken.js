/* eslint-disable no-undef */
import { AuthenticationError } from "apollo-server";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export default function verifyToken(token) {
	try {
		if (token) {
			return jwt.verify(token, process.env.JWT_TOKEN);
		}
		throw new AuthenticationError("You are not authenticated");
	} catch (error) {
		return null;
	}
}
