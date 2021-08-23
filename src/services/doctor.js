import { ApolloError } from "apollo-server-errors";
import firestore from "../firebase/firestore";
import auth from "../firebase/auth";

export const getDoctors = async () => {
	try {
		return await firestore().collection("doctors");
	} catch (error) {
		throw new ApolloError(error.message);
	}
};

export const getDoctorById = async (id) => {
	try {
		return await firestore().collection("doctors").doc(id).get();
	} catch (error) {
		throw new ApolloError(error.message);
	}
};

export const createDoctor = async (payload) => {
	try {
		delete payload.password;
		return await firestore().collection("doctors").add(payload);
	} catch (error) {
		throw new ApolloError(error.message);
	}
};

export const signUp = async (payload) => {
	try {
		await auth().createUserWithEmailAndPassword(
			payload.email,
			payload.password
		);
	} catch (error) {
		throw new ApolloError(error.message);
	}
};
