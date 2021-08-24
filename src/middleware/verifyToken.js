/* eslint-disable no-undef */
import { AuthenticationError } from "apollo-server";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import auth from "../firebase/auth";
dotenv.config();

export default function verifyToken(token) {
	try {
		const checkAuthOnFirebase = auth().currentUser;

		if (checkAuthOnFirebase && token) {
			return jwt.verify(token, process.env.JWT_TOKEN);
		}

		throw new AuthenticationError("You are not authenticated");
	} catch (error) {
		throw new AuthenticationError(error.message);
	}
}
