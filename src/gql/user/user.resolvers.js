/* eslint-disable no-undef */
import { ApolloError } from "apollo-server";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import {
	checkCurrentUser,
	createUser,
	doSignIn,
	doSignOut,
	doSignUp,
	getAllUsers,
	getUserByEmail,
	getUserById,
	updateUser,
} from "../../services/user";
config();

import { verifyToken } from "../../middleware";

const resolvers = {
	Query: {
		getAllUsers: async (_, args, { token }) => {
			verifyToken(token);

			const users = await getAllUsers();
			return users.docs.map((res) => ({ id: res.id, ...res.data() }));
		},
		getUserById: async (parent, args, { token }) => {
			try {
				verifyToken(token);

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

				await doSignIn(email, password);

				const user = await getUserByEmail(email);
				// eslint-disable-next-line no-undef
				const token = jwt.sign(user.docs[0].data(), process.env.JWT_TOKEN, {
					expiresIn: process.env.JWT_EXPIRED_TIME * 80,
				});

				return {
					id: user.docs[0].id,
					token,
					...user.docs[0].data(),
				};
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

				const token = jwt.sign(getUserCreated, process.env.JWT_TOKEN);

				return {
					id: createdUser.id,
					...getUserCreated,
					...signUp.credential,
					token,
				};
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		userSignOut: async () => {
			try {
				await doSignOut();

				return {
					status: "Successfully logged out!",
				};
			} catch (error) {
				throw new ApolloError(error.message);
			}
		},
		updateUser: async (parent, args, { token }) => {
			try {
				verifyToken(token);
				const currentUser = await checkCurrentUser();
				if (currentUser !== null) {
					const { id, payload } = args;

					if (payload.email) {
						(await checkCurrentUser()).updateEmail(payload.email);
					}

					if (payload.password) {
						(await checkCurrentUser()).updatePassword(payload.email);
					}

					await updateUser(id, payload);

					const getUser = await getUserById(id);

					return {
						id,
						...getUser.data(),
					};
				}

				throw new ApolloError("Error authentication", 401);
			} catch (error) {
				throw new ApolloError(error);
			}
		},
	},
};

export default resolvers;
