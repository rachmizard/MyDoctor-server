import userTypeDefs from "./user/user.typdefs";
import userResolvers from "./user/user.resolvers";
import doctorTypeDefs from "./doctor/doctor.typeDefs";
import doctorResolvers from "./doctor/doctor.resolvers";
import chatTypeDefs from "./chats/chat.typeDefs";
import chatResolvers from "./chats/chat.resolvers";

import merger from "../utils";
import { gql } from "apollo-server";

const defaultTypeDefs = gql`
	type Query {
		welcome: String
	}
`;

const defaultResolver = {
	Query: {
		welcome: () => "Hello welcome to API",
	},
};

const typeDefs = merger(
	defaultTypeDefs,
	userTypeDefs,
	doctorTypeDefs,
	chatTypeDefs
);

const resolvers = merger(
	defaultResolver,
	userResolvers,
	doctorResolvers,
	chatResolvers
);

export { typeDefs, resolvers };
