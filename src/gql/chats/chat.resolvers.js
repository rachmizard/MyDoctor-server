import moment from "moment";
import { getUserById } from "../../services/user";
import { getDoctorById } from "../../services/doctor";
import { sendMessage, getChats, getChat } from "../../services/chat";
import { ApolloError } from "apollo-server-core";

const chats = [
	{
		id: "1",
		doctor: {
			id: "xx1",
			fullName: "Nairobi",
			photoUrl: "https://google.com",
		},
		user: {
			id: "xxx",
			fullName: "Mizard",
		},
		messages: [],
	},
	{
		id: "2",
		doctor: {
			id: "xx2",
			fullName: "Steven",
			photoUrl: "https://google.com",
		},
		user: {
			id: "xxx",
			fullName: "Mizard",
		},
		messages: [
			{
				sentBy: "xxx",
				message: "Haloo",
				time: new Date().getTime(),

				chatDate: new Date().getTime(),
			},
			{
				sentBy: "xx2",
				message: "Haloo saya dari dokter steven ada yang bisa di bantu?",
				time: new Date().getTime(),

				chatDate: new Date().getTime(),
			},
		],
	},
];

function convertUnixTimestamp(ts, toTime = false) {
	if (toTime) {
		return moment(ts).format("HH:mm A");
	}

	return moment(ts).format("dddd, DD MMMM, YYYY");
}

const resolvers = {
	Query: {
		chats: (_, { userId, doctorId }) => {
			const getChats = chats;

			if (userId) {
				return getChats.filter((v) => v.user.id === userId);
			}

			if (doctorId) {
				return getChats.filter((v) => v.doctor.id === doctorId);
			}

			return getChats;
		},
		chat: (_, { chatId }) => {
			const getChat = chats.find((v) => v.id === chatId);
			const transformedMessages = getChat.messages.map((msg) => ({
				...msg,
				chatDate: convertUnixTimestamp(msg.chatDate),
				time: convertUnixTimestamp(msg.time, true),
			}));

			return {
				...getChat,
				messages: transformedMessages,
			};
		},
	},
	Mutation: {
		addMessage: async (_, { doctorId, userId, senderId, message }) => {
			try {
				const find = await getChats().then((res) => {
					return res.query
						.where("doctor.id", "==", doctorId)
						.where("user.id", "==", userId)
						.get();
				});

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
					time: convertUnixTimestamp(new Date().getTime(), true),
					chatDate: convertUnixTimestamp(new Date().getTime()),
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
