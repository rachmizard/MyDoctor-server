import userTypeDefs from "./user/user.typdefs";
import userResolvers from "./user/user.resolvers";
import merger from "../../utils";
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

const typeDefs = merger(defaultTypeDefs, userTypeDefs);

const resolvers = merger(defaultResolver, userResolvers);

export { typeDefs, resolvers };
