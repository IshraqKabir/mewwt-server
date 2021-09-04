import { Namespace } from "socket.io";
import { UNAUTHORIZED } from "../config/consts";
import { User } from "../models/User";
import { isRoomUser } from "../utils/isRoomUser";
import { wsAuth } from "./middlewares/wsAuth";

export const initRoomIo = async (roomSpaces: Namespace) => {
    roomSpaces.use(wsAuth);

    roomSpaces.on("connection", async (socket) => {
        const user = socket.data.user as User;
        const roomId = socket.handshake.auth.roomId as number;

        if (!isRoomUser(roomId, user)) {
            socket.disconnect();
            throw new Error(UNAUTHORIZED);
        }

        console.log(`${user.first_name} has connected to room: ${roomId}`);

        await socket.join(`room-${roomId}`);
    });
};
