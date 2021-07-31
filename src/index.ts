import "reflect-metadata";
import express from "express";
import cors from "cors";

import { createConnection, createQueryBuilder, getConnection } from "typeorm";
import { connectionOptions } from "./config/typeorm/connectionOptions";
import { PORT } from "./config/consts";

import authRoutes from "./routes/user/auth";
import roomRoutes from "./routes/room/room";
import messageRoutes from "./routes/message/message";

const main = async () => {
    const app = express();

    await createConnection(connectionOptions);

    app.use(cors({
        origin: "*",
        credentials: true,
    }));

    // const user = await User.findOne(3, {
    //     relations: [ "roomsUsers" ]
    // });

    // // console.log("user", user);

    // if (user) {
    //     const userRooms = await getConnection()
    //         .getRepository(User)
    //         .createQueryBuilder("user")
    //         .select([ "user.id", "user.email", "ru.user_id", "ru.room_id", "ru.created_at", "room.name", "room.id" ])
    //         .leftJoin("user.roomsUsers", "ru")
    //         .leftJoin("ru.room", "room")
    //         .where("user.id = :userId", { userId: 3 })
    //         .orderBy("ru.created_at", "ASC")
    //         .groupBy("user.id")
    //         .getMany();

    //     userRooms?.forEach(uR => {
    //         console.log(uR);
    //         uR?.roomsUsers?.forEach(rU => {
    //             console.log(rU);
    //         });
    //     });
    //     // console.log("rooms", userRooms[ 0 ]?.roomsUsers[ 0 ]?.room);
    // }

    app.use(express.json());

    app.use(express.urlencoded({
        extended: true
    }));

    app.use('/api/auth', authRoutes);
    app.use('/api/room', roomRoutes);
    app.use('/api/message', messageRoutes);

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

main();
