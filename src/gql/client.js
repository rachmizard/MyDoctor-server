import { ApolloServer } from "apollo-server";
import firebaseClient from "../firebase";
import { resolvers, typeDefs } from "./registerSchema";

export async function startApolloServer() {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req }) => {
			return {
				headers: req.headers,
				firebaseClient,
			};
		},
	});
	const { url } = await server.listen();
	console.log(`🚀 Server ready at ${url}`);
}
