import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { resolvers } from "./config/graphql/resolvers";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { createConnection } from "typeorm";
import { connectionOptions } from "./config/typeorm/connectionOptions";
import express from "express";
import cors from "cors";

// dotenv config
import { TOKEN_SECRET } from "./config/consts";

import jwt from "jsonwebtoken";

const PORT: number = 4000;

const path = "/graphql";

const main = async () => {
    const app = express();

    app.use(cors({
        origin: "https://studio.apollographql.com",
        credentials: true,
    }))
    await createConnection(connectionOptions);

    const schema = await buildSchema({
        resolvers: resolvers,
        authChecker: ({ context }) => {
            if (context.user) {
                return true;
            }

            return false;
        },
    })

    const server = new ApolloServer({
        schema,
        context: async ({ res, req }) => {
            // console.log("request headers", req.headers.authorization);
            if (req.headers.authorization) {
                console.log("user", jwt.verify(req.headers.authorization, TOKEN_SECRET))
            }

            return {
                user: {
                    id: 1,
                    name: "sfasdf",
                    roles: ["REGULAR"]
                },
                ...res,
                ...req,
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

