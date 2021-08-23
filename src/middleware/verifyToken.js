/* eslint-disable no-undef */
import { AuthenticationError } from "apollo-server";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import auth from "../firebase/auth";
dotenv.config();

export default function verifyToken(token) {
	const currentUser = auth().currentUser;
	if (currentUser === null) {
		throw new AuthenticationError("You are not authenticated");
	}

	return jwt.verify(token, process.env.JWT_TOKEN);
}
