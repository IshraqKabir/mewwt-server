import { Namespace } from "socket.io";
import { CONNECTION } from "../config/consts";
import { User } from "../models/User";
import { handleUserSocketConnect } from "../services/UserSocketService/handleUserSocketConnect";
import { handleUserSocketDisconnect } from "../services/UserSocketService/handleUserSocketDisconnect";
import { wsAuth } from "./middlewares/wsAuth";

export const initUserIo = async (userSpaces: Namespace) => {
    userSpaces.use(wsAuth);

    userSpaces.on(CONNECTION, async (socket) => {
        const user = socket.data.user as User;

        handleUserSocketConnect(user, socket);

        socket.on("disconnecting", () => {
            handleUserSocketDisconnect(user, socket);
        });

        // socket.on("user-started-typing", () => {

        // });

        await socket.join(`user-${user.id}`);
    });
};
