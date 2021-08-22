import { ApolloError } from "apollo-server";
import {
	getAllUsers,
	doSignIn,
	getUserByEmail,
	doSignUp,
	createUser,
	getUserById,
} from "../../../services/user";

const resolvers = {
	Query: {
		getAllUsers: async () => {
			const users = await getAllUsers();
			return users.docs.map((res) => ({ id: res.id, ...res.data() }));
		},
		getUserById: async (parent, args) => {
			try {
				const { id } = args;

				const findUser = await getUserById(id);

				if (!findUser.exists) {
					throw new ApolloError("User doesn't exists!");
				}

				return {
					id: findUser.id,
					...findUser.data(),
				};
			} catch (error) {
				throw new ApolloError(error);
			}
		},
	},
	Mutation: {
		userSignIn: async (parent, args) => {
			try {
				const { email, password } = args;

				const signIn = await doSignIn(email, password);

				const user = await getUserByEmail(signIn.user.email);

				const response = {
					id: user.docs[0].id,
					...user.docs[0].data(),
					...signIn.additionalUserInfo,
				};

				return response;
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		userSignUp: async (parent, args) => {
			try {
				const { email, password, fullName, job } = args;

				const signUp = await doSignUp(email, password);

				const createdUser = await createUser(email, fullName, job);

				const getUserCreated = (await createdUser.get()).data();

				return {
					id: createdUser.id,
					...getUserCreated,
					...signUp.credential,
				};
			} catch (error) {
				throw new ApolloError(error);
			}
		},
	},
};

export default resolvers;
