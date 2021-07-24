import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { resolvers } from "./config/graphql/resolvers";
import { ApolloServer } from "apollo-server-express";
import { createConnection, getConnection } from "typeorm";
import { connectionOptions } from "./config/typeorm/connectionOptions";
import express from "express";
import cors from "cors";

// dotenv config
import { TOKEN_SECRET } from "./config/consts";

import jwt from "jsonwebtoken";
import { ApolloContext } from "./types/ApolloContext";
import { User } from "./model/User";

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
        context: async ({ res, req }: ApolloContext) => {
            let user: User | null = null;
            if (req.headers.authorization) {
                try {
                    const userInfo: any = jwt.verify(req.headers.authorization, TOKEN_SECRET);
                    const userId = userInfo?.id;

                    const userFromDB = await getConnection().getRepository(User)
                        .findOne(userId, {
                            relations: ["authToken"]
                        });

                    if (userFromDB) {
                        user = userFromDB;
                    }
                } catch (_) { }

            }

            return {
                user: user,
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

