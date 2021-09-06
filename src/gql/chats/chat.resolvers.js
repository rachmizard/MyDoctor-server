import { getUserById } from "../../services/user";
import { getDoctorById } from "../../services/doctor";
import { sendMessage, getChats, getChat } from "../../services/chat";
import { ApolloError } from "apollo-server-core";
import { convertDate } from "../../utils";

const transformedIdOfCollections = (item) => ({
	id: item.id,
	...item.data(),
});

const resolvers = {
	Query: {
		chats: async (_, { userId, doctorId }) => {
			try {
				const chats = await getChats().get();

				if (userId && doctorId) {
					const query = await chats.query
						.where("user.id", "==", userId)
						.where("doctor.id", "==", doctorId)
						.get();

					return query.docs.map(transformedIdOfCollections);
				}

				if (userId) {
					const query = await chats.query.where("user.id", "==", userId).get();

					return query.docs.map(transformedIdOfCollections);
				}

				if (doctorId) {
					const query = await chats.query
						.where("doctor.id", "==", doctorId)
						.get();

					return query.docs.map(transformedIdOfCollections);
				}

				return chats.docs.map(transformedIdOfCollections);
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		chat: (_, { chatId }) => {
			return getChat(chatId)
				.get()
				.then(transformedIdOfCollections)
				.catch((err) => {
					throw new ApolloError(err);
				});
		},
		chatWithSpecificId: async (_, { userId, doctorId }) => {
			const chats = await getChats().get();

			const query = await chats.query
				.where("user.id", "==", userId)
				.where("doctor.id", "==", doctorId)
				.get();

			if (query.empty) {
				return {};
			}

			return transformedIdOfCollections(query.docs[0]);
		},
	},
	Mutation: {
		addMessage: async (_, { doctorId, userId, senderId, message }) => {
			try {
				const find = await getChats()
					.where("doctor.id", "==", doctorId)
					.where("user.id", "==", userId)
					.get();

				const doctor = await getDoctorById(doctorId);
				const user = await getUserById(userId);

				if (!doctor.exists || !user.exists) {
					throw new ApolloError("User or Doctor not found in our records", 500);
				}

				// initialize state
				const initialize = {
					doctor: {
						id: doctor.id,
						...doctor.data(),
					},
					user: {
						id: user.id,
						...user.data(),
					},
					messages: [],
				};

				// message payload state
				const messagePayload = {
					sentBy: senderId,
					message,
					time: convertDate.convertUnixTimestamp(new Date().getTime(), true),
					chatDate: convertDate.convertUnixTimestamp(new Date().getTime()),
				};

				if (find.docs.length === 0) {
					// send initialize chat.
					return sendMessage({
						...initialize,
						messages: [messagePayload],
					})
						.then(() => true)
						.catch(() => false);
				}

				// send existing chat to the target user/doctor.
				find.docs.forEach(async (res) => {
					await getChat(res.id).update({
						...initialize,
						messages: [...res.data().messages, messagePayload],
					});
				});

				return true;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
	},
};

export default resolvers;
