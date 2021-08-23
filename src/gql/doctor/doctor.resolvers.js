import {
	createDoctor,
	getDoctorById,
	getDoctors,
	signUp,
} from "../../services/doctor";
import { JWT } from "../../utils";

const resolvers = {
	Query: {
		getDoctorsByCategory: async (_, { category }) => {
			const doctors = (await getDoctors(category))
				.where("category", "==", category)
				.get();

			const results = (await doctors).docs;

			return results.map((res) => ({
				id: res.id,
				...res.data(),
			}));
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
		doctorSignIn: async (_, { email, password }) => {},
	},
};

export default resolvers;
