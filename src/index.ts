import "reflect-metadata";
import express from "express";
import cors from "cors";

import { createConnection } from "typeorm";
import { connectionOptions } from "./config/typeorm/connectionOptions";
import { PORT } from "./config/consts";

import authRoutes from "./routes/user/auth";
import roomRoutes from "./routes/room/room";

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

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

main();

// const connection = getConnection();

// const user = await connection.manager.findOne(User, {
//     where: { id: 1 },
//     relations: ["rooms"],
// });

// console.log(user?.rooms);

// add users to a room

// const connection = getConnection();

// const room = await connection.manager.findOne(Room, {
//     where: {
//         id: 1
//     },
//     relations: [ "users" ]
// });

// if (room) {
//     const user = await connection.manager.findOne(User, {
//         where: { id: 2 },
//     });

//     if (user) {
//         await connection.manager.save(user);

//         room.users = [ user ];
//         room.name = "asdf";

//         await connection.manager.save(room);
//         console.log("done");
//     }
// }
