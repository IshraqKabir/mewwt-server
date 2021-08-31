import { Namespace } from "socket.io";
import { CONNECTION, CONNECT_ERROR, DISCONNECT } from "../config/consts";
import { User } from "../models/User";
import { wsAuth } from "./middlewares/wsAuth";
import { wsCheckUser } from "./middlewares/wsCheckUser";
import { handleUserSocketConnect } from "../services/UserSocketService/handleUserSocketConnect";
import { handleUserSocketDisconnect } from "../services/UserSocketService/handleUserSocketDisconnect";

export const initUserIo = async (userSpaces: Namespace) => {
    userSpaces.use(wsAuth);
    userSpaces.use(wsCheckUser);

    userSpaces.on(CONNECTION, async (socket) => {
        const user = socket.data.user as User;

        handleUserSocketConnect(user, socket);

        console.log(`${user.first_name} has loggedin`);

        socket.on(DISCONNECT, (reason) => {
            handleUserSocketDisconnect(user, socket);
            console.log(` ${user.first_name} has disconnected ${reason}`);
        });

        socket.on(CONNECT_ERROR, () => {
            console.log("connect error");
        });

        socket.join(`user-${user.id}`);

        socket.on("connect_error", (error) => {
            console.log("error", error);
        });
    });

    userSpaces.on("connect_error", (err) => {
        console.log("error", err);
    });
};
