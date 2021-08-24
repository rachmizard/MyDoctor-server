import { ApolloServer } from "apollo-server-express";
import express from "express";
import { resolvers, typeDefs } from "./registerSchema";

export async function startApolloServer() {
	const app = express();
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
	await server.start();
	server.applyMiddleware({ app });
	app.listen({ port: 4000 }, () => {
		console.log(
			`🚀 Server ready at http://localhost:4000${server.graphqlPath}`
		);
	});
}
