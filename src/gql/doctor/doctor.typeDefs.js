import { gql } from "apollo-server";

const typeDefs = gql`
	extend type Query {
		getAllDoctors: [Doctor]
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
	}

	input DoctorInput {
		email: String!
		fullName: String!
		category: String!
		title: String!
	}

	type Doctor {
		id: ID!
		email: String!
		fullName: String!
		category: String!
		title: String!
		totalRatings: Int
		avgRating: Int
	}
`;

export default typeDefs;
