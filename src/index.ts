import "reflect-metadata";
import express from "express";
import cors from "cors";

import { createConnection, createQueryBuilder, getConnection } from "typeorm";
import { connectionOptions } from "./config/typeorm/connectionOptions";
import { PORT } from "./config/consts";

import authRoutes from "./routes/user/auth";
import roomRoutes from "./routes/room/room";
import messageRoutes from "./routes/message/message";
import usersRoutes from "./routes/users/users";

const main = async () => {
    const app = express();

    await createConnection(connectionOptions);

    app.use(cors({
        origin: "*",
        credentials: true,
    }));

    app.use(express.json());

    app.use(express.urlencoded({
        extended: true
    }));

    app.use('/api/auth', authRoutes);
    app.use('/api/room', roomRoutes);
    app.use('/api/message', messageRoutes);
    app.use('/api/users', usersRoutes);

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

main();
