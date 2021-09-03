import { io } from "..";
import { User } from "../models/User";
import { wsAuth } from "./middlewares/wsAuth";
import { wsCheckUser } from "./middlewares/wsCheckUser";

export const initIo = () => {
    io.use(wsAuth);
    io.use(wsCheckUser);

    io.on("connection", (socket) => {
        const user = socket.data.user as User;

        console.log(`${user.id}.${user.first_name} has joined global io`);
    });
};
