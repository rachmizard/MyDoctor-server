import { gql } from "apollo-server";

const typeDefs = gql`
	extend type Query {
		chats(userId: ID, doctorId: ID): [Chat]
		chat(chatId: ID!): Chat
	}

	extend type Mutation {
		addMessage(
			doctorId: ID!
			userId: ID!
			senderId: ID!
			message: String
		): Boolean
	}

	type Chat {
		id: ID
		doctor: Doctor
		user: User
		messages: [Message]
	}

	type Message {
		sentBy: ID!
		message: String
		time: String
		chatDate: String
	}
`;

export default typeDefs;
