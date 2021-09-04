import { Namespace } from "socket.io";
import { CONNECTION, CONNECT_ERROR, DISCONNECT } from "../config/consts";
import { User } from "../models/User";
import { handleUserSocketConnect } from "../services/UserSocketService/handleUserSocketConnect";
import { handleUserSocketDisconnect } from "../services/UserSocketService/handleUserSocketDisconnect";
import { wsAuth } from "./middlewares/wsAuth";

export const initUserIo = async (userSpaces: Namespace) => {
    userSpaces.use(wsAuth);

    userSpaces.on(CONNECTION, async (socket) => {
        const user = socket.data.user as User;

        handleUserSocketConnect(user, socket);

        console.log("user spaces connected");

        socket.on(CONNECTION, () => {
            console.log(`${user.id}.${user.first_name} has logged in`);
        });

        socket.on(DISCONNECT, (reason) => {
            console.log(` ${user.first_name} has disconnected ${reason}`);
        });

        socket.on("disconnecting", () => {
            handleUserSocketDisconnect(user, socket);
            console.log(`${user.id}.${user.first_name}`, "disconnecting");
        });

        socket.on(CONNECT_ERROR, () => {
            console.log("connect error");
        });

        await socket.join(`user-${user.id}`);

        socket.on("connect_error", (error) => {
            console.log("error", error);
        });
    });

    userSpaces.on("logout", () => {
        console.log("received logout");
    });
};
