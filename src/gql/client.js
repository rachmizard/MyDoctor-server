import { ApolloServer } from "apollo-server-express";
import express from "express";
import { resolvers, typeDefs } from "./registerSchema";
import http from "http";

export async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const port = process.env.PORT || 5000;
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

  await new Promise((resolve) => httpServer.listen({ port }, resolve));

  if (process.env.NODE_ENV === "production") {
    return console.log("Production mode: ON");
  }

  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}
