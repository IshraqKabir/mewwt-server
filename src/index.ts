import "reflect-metadata";
import express from "express";
import http from "http";
import cors from "cors";

import { createConnection } from "typeorm";
import { connectionOptions } from "./config/typeorm/connectionOptions";
import { PORT } from "./config/consts";

import authRoutes from "./routes/user/auth";
import roomRoutes from "./routes/room/room";
import messageRoutes from "./routes/message/message";
import usersRoutes from "./routes/users/users";
import { Server } from "socket.io";
import { initIo } from "./ws/initIo";
import { initRoomIo } from "./ws/initRoomIo";
import { initUserIo } from "./ws/initUserIo";
import { getRoomPresences } from "./utils/getRoomPresences";
import { getRoomMessagesQuery } from "./queries/getRoomMessagesQuery";

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*:*",
    },
});

export const roomSpaces = io.of("/room");
export const userSpaces = io.of("/user");

const main = async () => {
    await createConnection(connectionOptions);

    // express middlewares
    app.use(
        cors({
            origin: "*",
            credentials: true,
        })
    );

    app.use(express.json());

    app.use(
        express.urlencoded({
            extended: true,
        })
    );

    // express routes
    app.use("/api/auth", authRoutes);
    app.use("/api/room", roomRoutes);
    app.use("/api/message", messageRoutes);
    app.use("/api/users", usersRoutes);

    // socket io
    initIo();
    initRoomIo(roomSpaces);
    initUserIo(userSpaces);

    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

main();
