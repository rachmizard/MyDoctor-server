import { ApolloError } from "apollo-server";
import firestore from "../firebase/firestore";
import auth from "../firebase/auth";

export const getAllUsers = async (limit = 50) => {
	try {
		return await firestore().collection("users").limit(limit).get();
	} catch (error) {
		throw new ApolloError(error);
	}
};

export const getUserByEmail = async (email) => {
	try {
		return await firestore()
			.collection("users")
			.where("email", "==", email)
			.get();
	} catch (error) {
		throw new ApolloError(error);
	}
};

export const createUser = async (email, fullName, job) => {
	try {
		return await firestore().collection("users").add({
			email,
			fullName,
			job,
		});
	} catch (error) {
		throw new ApolloError(error);
	}
};

export const doSignIn = async (email, password) => {
	try {
		const signIn = await auth().signInWithEmailAndPassword(email, password);
		return signIn;
	} catch (error) {
		throw new ApolloError(error);
	}
};

export const doSignUp = async (email, password) => {
	try {
		return await auth().createUserWithEmailAndPassword(email, password);
	} catch (error) {
		throw new ApolloError(error);
	}
};
