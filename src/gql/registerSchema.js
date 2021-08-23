import userTypeDefs from "./user/user.typdefs";
import userResolvers from "./user/user.resolvers";
import doctorTypeDefs from "./doctor/doctor.typeDefs";
import doctorResolvers from "./doctor/doctor.resolvers";
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

const typeDefs = merger(defaultTypeDefs, userTypeDefs, doctorTypeDefs);

const resolvers = merger(defaultResolver, userResolvers, doctorResolvers);

export { typeDefs, resolvers };
