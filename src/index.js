import { startApolloServer } from "./gql/client";
import { transform } from "@babel/core";

transform("code", {
  plugins: ["inline-dotenv"],
});

startApolloServer();
