import { Namespace } from "socket.io";
import { io } from "..";
import { DISCONNECT, UNAUTHORIZED } from "../config/consts";
import { User } from "../models/User";
import { IRoomPresence } from "../types/IRoomPresence";
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

        await socket.join(`room-${roomId}`);

        io.of("/room").to(`room-${roomId}`).emit("user-joined", {
            userId: user.id,
            isPresent: true,
            isTyping: false
        } as IRoomPresence);

        socket.on(DISCONNECT, () => {
            io.of("/room").to(`room-${roomId}`).emit("user-left", {
                userId: user.id,
                isPresent: false,
                isTyping: false
            } as IRoomPresence);
        });
    });
};
