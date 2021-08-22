import { ApolloServer } from "apollo-server";
import { resolvers, typeDefs } from "./registerSchema";

export async function startApolloServer() {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req }) => {
			const token = req.get("Authorization") || "";
			return {
				token,
			};
		},
	});
	const { url } = await server.listen();
	console.log(`🚀 Server ready at ${url}`);
}
