import { ApolloError, UserInputError } from "apollo-server-core";
import {
	createDoctor,
	getDoctorByEmail,
	getDoctorById,
	getDoctorsByCategory,
	signIn,
	signUp,
} from "../../services/doctor";
import { JWT } from "../../utils";
import { verifyToken } from "../../middleware";

const resolvers = {
	Query: {
		getDoctorsByCategory: async (_, { category, limit }, { token }) => {
			verifyToken(token);

			try {
				if (!category) {
					throw new UserInputError(
						"We are unable fulfill your request due to category field was not existed!"
					);
				}

				return await getDoctorsByCategory(category, limit);
			} catch (error) {
				throw new ApolloError(error.message);
			}
		},
		getDoctorById: async (_, { id }) => {
			const doctor = await getDoctorById(id);

			return {
				id: doctor.id,
				...doctor.data(),
			};
		},
	},
	Mutation: {
		doctorSignUp: async (_, { payload }) => {
			await signUp(payload);

			const doctorCreated = await createDoctor(payload);
			const doctor = await doctorCreated.get();

			const token = JWT.jwtSign(doctor.data());

			return {
				id: doctor.id,
				...doctor.data(),
				token,
			};
		},
		doctorSignIn: async (_, { email, password }) => {
			const signed = await signIn(email, password);
			const getDoctor = await getDoctorByEmail(signed.user.email);
			const result = getDoctor.docs[0];

			const token = JWT.jwtSign(result.data());

			return {
				id: result.id,
				token,
				...result.data(),
			};
		},
	},
};

export default resolvers;
