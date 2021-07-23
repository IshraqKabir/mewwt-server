import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { resolvers } from "./config/graphql/resolvers";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { connectionOptions } from "./config/typeorm/connectionOptions";
import express from "express";

// dotenv config
import dotenv from "dotenv";
dotenv.config();

const PORT: number = 4000;

const app = express();
const path = "/graphql";

const main = async () => {
    await createConnection(connectionOptions);

    const schema = await buildSchema({
        resolvers: resolvers,
        authChecker: ({ context }) => {
            if (context.user) {
                return true;
            }

            return false;
        }
    })

    const server = new ApolloServer({
        schema,
        context: ({ req }) => {
            return {
                user: {
                    id: 1,
                    name: "sfasdf",
                    roles: ["REGULAR"]
                }
            }
        },
    });

    await server.start();

    server.applyMiddleware({ app, path })

    app.listen({ port: PORT }, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    })
}

main();

