import { ApolloError } from "apollo-server";
import auth from "../firebase/auth";
import firestore from "../firebase/firestore";

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

export const getUserById = async (id) => {
	try {
		return await firestore().collection("users").doc(id).get();
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

export const updateUser = async (id, payload) => {
	try {
		return await firestore().collection("users").doc(id).update(payload);
	} catch (error) {
		throw new ApolloError(error);
	}
};

export const doSignIn = async (email, password) => {
	try {
		return await auth().signInWithEmailAndPassword(email, password);
	} catch (error) {
		throw new ApolloError(error.message);
	}
};

export const doSignUp = async (email, password) => {
	return auth().createUserWithEmailAndPassword(email, password);
};

export const doSignOut = async () => {
	return auth().signOut();
};

export const checkCurrentUser = async () => {
	try {
		return auth().currentUser;
	} catch (error) {
		throw new ApolloError(error);
	}
};
