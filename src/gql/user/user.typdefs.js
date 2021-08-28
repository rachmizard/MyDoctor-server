import { gql } from "apollo-server";

const typeDefs = gql`
	extend type Query {
		getAllUsers: [User]
		getUserById(id: ID!): User
	}

	type Mutation {
		userSignIn(email: String!, password: String!): UserSignInOrSignUpResponse!
		userSignUp(payload: UserInput!): UserSignInOrSignUpResponse!
		updateUser(id: ID!, payload: UserInput!): User!
		userSignOut: UserSignOutResponse!
		uploadUserPhoto(file: FileUploadInput!): FileUploadResponse!
	}

	type FileUploadResponse {
		success: Boolean
		url: String
	}

	input FileUploadInput {
		base64: String
		uri: String
		width: Int
		height: Int
		fileSize: Int
		type: String
		fileName: String
	}

	type UserSignOutResponse {
		status: String
	}

	type UserSignInOrSignUpResponse {
		id: ID!
		email: String!
		fullName: String!
		job: String!
		photoUrl: String
		token: String
	}

	input UserInput {
		email: String
		fullName: String
		job: String
		password: String
		photoUrl: String
	}

	type User {
		id: ID!
		email: String!
		fullName: String!
		job: String!
		photoUrl: String
	}
`;

export default typeDefs;
