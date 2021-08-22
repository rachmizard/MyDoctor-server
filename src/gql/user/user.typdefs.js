import { gql } from "apollo-server";

const typeDefs = gql`
	extend type Query {
		getAllUsers: [User]
	}

	type Mutation {
		userSignIn(email: String!, password: String!): UserSignInOrSignUpResponse!
		userSignUp(
			email: String!
			password: String!
			fullName: String!
			job: String!
		): UserSignInOrSignUpResponse!
	}

	type UserSignInOrSignUpResponse {
		id: ID!
		email: String!
		fullName: String!
		job: String!
		isNewUser: Boolean
		profile: String
		providerId: String
		username: String
		signInMethod: String
	}

	type User {
		id: ID!
		email: String!
		fullName: String!
		job: String!
	}
`;

export default typeDefs;
