import { Namespace } from "socket.io";
import { User } from "../models/User";
import { wsAuth } from "./middlewares/wsAuth";
import { wsCheckUser } from "./middlewares/wsCheckUser";

export const initUserIo = async (userSpaces: Namespace) => {
    userSpaces.use(wsAuth);
    userSpaces.use(wsCheckUser);

    userSpaces.on("connection", (socket) => {
        const user = socket.data.user as User;

        console.log(`${user.first_name} has connected to user-${user.id}`);

        socket.join(`user-${user.id}`);

    });
};
