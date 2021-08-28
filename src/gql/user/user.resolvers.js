/* eslint-disable no-undef */
import { ApolloError } from "apollo-server";
import { config } from "dotenv";
import { verifyToken } from "../../middleware";
import {
	checkCurrentUser,
	createUser,
	doSignIn,
	doSignOut,
	doSignUp,
	getAllUsers,
	getUserByEmail,
	getUserById,
	getUserPhotoStorage,
	updateUser,
	uploadUserPhoto,
} from "../../services/user";
import { JWT } from "../../utils";
config();

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

				if (user.docs.length === 0) {
					throw new ApolloError("User not found in our records", 500);
				}

				const token = JWT.jwtSign(user.docs[0].data());

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
				const { payload } = args;

				await doSignUp(payload.email, payload.password);

				const createdUser = await createUser(payload);

				const getUserCreated = await getUserByEmail(payload.email);

				if (getUserCreated.docs.length === 0) {
					throw new ApolloError("User not found in our records", 500);
				}

				const token = JWT.jwtSign({
					id: getUserCreated.docs[0].id,
					...getUserCreated.docs[0].data(),
				});

				return {
					id: createdUser.id,
					...getUserCreated.docs[0].data(),
					token,
				};
			} catch (error) {
				throw new ApolloError(error);
			}
		},
		userSignOut: async (_, args, { token }) => {
			try {
				verifyToken(token);

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
		uploadUserPhoto: async (_, { file }, { token }) => {
			const { base64, fileName, type } = await file;
			const user = verifyToken(token);

			await uploadUserPhoto(base64, fileName, type);
			const url = await getUserPhotoStorage(fileName);

			await updateUser(user.id, { photoUrl: url });

			return {
				success: true,
				url,
			};
		},
	},
};

export default resolvers;
