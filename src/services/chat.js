import { ApolloError } from "apollo-server-core";
import firestore from "../firebase/firestore";

export const getChats = async (userId = "", doctorId = "") => {
	try {
		return await firestore().collection("chats").get();
	} catch (error) {
		throw new ApolloError(error.message);
	}
};

export const getChat = (chatId) => {
	return firestore().collection("chats").doc(chatId);
};

export const sendMessage = async (payload) => {
	try {
		return await firestore().collection("chats").add(payload);
	} catch (error) {
		throw new ApolloError(error.message);
	}
};
