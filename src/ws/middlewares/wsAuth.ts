import { Socket } from "socket.io";
import { UNAUTHENTICATED } from "../../config/consts";
import { getUserFromToken } from "../../utils/getUserFromToken";

export const wsAuth = async (socket: Socket, next: Function) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        console.log("failed at wsAuth: 9");
        next(new Error(UNAUTHENTICATED));
        socket.disconnect();
    }

    const user = await getUserFromToken(token);

    if (user) {
        socket.data.user = user;
    } else {
        console.log("failed at wsAuth: 19");
        next(new Error(UNAUTHENTICATED));
        socket.disconnect();
    }

    next();
};
