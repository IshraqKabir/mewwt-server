import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { resolvers } from "./config/graphql/resolvers";
import jwt from "express-jwt";
import { userInfo } from "os";
import { ApolloServer } from "apollo-server";

const PORT: number = 4000;

const main = async () => {
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

        }
    })

    // Start the server
    const { url } = await server.listen(PORT);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
}


main();

