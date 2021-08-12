import "reflect-metadata";
import express from "express";
import http from "http";
import cors from "cors";

import { createConnection, getConnection } from "typeorm";
import { connectionOptions } from "./config/typeorm/connectionOptions";
import { PORT } from "./config/consts";

import authRoutes from "./routes/user/auth";
import roomRoutes from "./routes/room/room";
import messageRoutes from "./routes/message/message";
import usersRoutes from "./routes/users/users";
import { Server } from "socket.io";
import { initIo } from "./ws/initIo";
import { initRoomIo } from "./ws/initRoomIo";
import { User } from "./models/User";
import { getPrevRoomId } from "./controllers/room/createRoomController";
import { RoomsUsers } from "./models/RoomsUsers";

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*:*",
    },
});

export const roomSpaces = io.of(/^\/(room)-\d+$/);

const main = async () => {
    await createConnection(connectionOptions);

    // express middlewares
    app.use(cors({
        origin: "*",
        credentials: true,
    }));

    app.use(express.json());

    app.use(express.urlencoded({
        extended: true,
    }));

    // express routes
    app.use('/api/auth', authRoutes);
    app.use('/api/room', roomRoutes);
    app.use('/api/message', messageRoutes);
    app.use('/api/users', usersRoutes);

    // socket io
    initIo();
    initRoomIo(roomSpaces);

    // const users = await getConnection()
    //     .createQueryBuilder(User, "user")
    //     .where("id IN (:...ids)", { ids: [ 3, 5, 7 ] })
    //     .getMany();

    // const roomId = await getPrevRoomId(users);

    // console.log("roomId", roomId);

    // const room = await getConnection()
    //     .createQueryBuilder()
    //     .select("ru2.room_id")
    //     // .addSelect("count(ru2.user_id)", "users")
    //     .from(RoomsUsers, "ru2")
    //     // .leftJoin(RoomsUsers, "ru2", "ru2.room_id = ru1.room_id")
    //     .where("ru2.user_id = 3")
    //     // .groupBy("ru2.room_id")
    //     .getRawMany();

    // const room = await getConnection()
    //     .createQueryBuilder(RoomsUsers, "ru")
    //     .getRawMany();

    // console.log(room);


    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

main();
