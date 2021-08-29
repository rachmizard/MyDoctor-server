import { gql } from "apollo-server";

const typeDefs = gql`
	extend type Query {
		getDoctorsByCategory(category: String!, limit: Int): [Doctor]
		getDoctorById(id: ID!): Doctor
	}

	type Mutation {
		doctorSignIn(email: String!, password: String!): SignInOrSignUpResponse!
		doctorSignUp(payload: DoctorInput!): SignInOrSignUpResponse!
		updateDoctor(id: ID!, payload: DoctorInput!): Doctor!
	}

	type SignInOrSignUpResponse {
		id: ID!
		email: String!
		fullName: String!
		category: String!
		title: String!
		token: String
	}

	input DoctorInput {
		email: String!
		password: String!
		fullName: String!
		category: String!
		title: String!
		gender: String!
	}

	type Doctor {
		id: ID!
		email: String!
		fullName: String!
		category: String!
		title: String!
		gender: String!
		photoUrl: String
		totalRatings: Int
		avgRating: Int
	}
`;

export default typeDefs;
