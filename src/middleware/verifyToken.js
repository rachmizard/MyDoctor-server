/* eslint-disable no-undef */
import { AuthenticationError } from "apollo-server";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export default function verifyToken(token) {
	try {
		return jwt.verify(token, process.env.JWT_TOKEN);
	} catch (error) {
		throw new AuthenticationError("You are not authenticated");
	}
}
