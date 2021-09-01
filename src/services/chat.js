import { ApolloError } from "apollo-server-core";
import firestore from "../firebase/firestore";

export const getChats = () => {
	return firestore().collection("chats");
};

export const getChat = (chatId) => {
	try {
		return firestore().collection("chats").doc(chatId);
	} catch (error) {
		throw new ApolloError(error.message);
	}
};

export const sendMessage = async (payload) => {
	try {
		return await firestore().collection("chats").add(payload);
	} catch (error) {
		throw new ApolloError(error.message);
	}
};
