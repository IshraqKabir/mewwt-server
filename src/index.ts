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

import Redis from "ioredis";
const redis = new Redis();

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*:*",
    },
});

export const roomSpaces = io.of(/^\/(room)-\d+$/);
export const userSpaces = io.of(/^\/(user)-\d+$/);

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

    // redis
    redis.subscribe("logout", (err, count) => {
        if (err) {
            // console.error("Failed to subscribe", err.message);
        } else {
            console
                .log
                // `Subscribed successfully! This client is currently subscribed to ${count} channels.`
                ();
        }
    });

    redis.subscribe("login", (err, count) => {
        if (err) {
            // console.error("Failed to subscribe", err.message);
        } else {
            // `Subscribed successfully! This client is currently subscribed to ${count} channels.`
        }
    });

    redis.on("message", (channel, message) => {
        console.log(`Received ${message} from ${channel}`);

        if (channel === "login") {
            userSpaces.emit("login", message);
        } else if (channel === "logout") {
            userSpaces.emit("logout", message);
        }
    });

    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

main();
