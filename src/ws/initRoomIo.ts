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

        socket.on("user-started-typing", ({ userIds }: { userIds: number[]; }) => {
            io.of("/room").to(`room-${roomId}`).emit("user-started-typing", {
                userId: user.id
            });

            io.of("/user").sockets.forEach(socket => {
                const socketUser = socket.data.user as User;

                if (userIds?.includes(socketUser?.id) && socketUser?.id !== user.id) {
                    socket.emit("user-started-typing", ({ roomId: roomId, userId: user.id }));
                }
            });
        });

        socket.on("user-stopped-typing", ({ userIds }: { userIds: number[]; }) => {
            io.of("/room").to(`room-${roomId}`).emit("user-stopped-typing", {
                userId: user.id,
            });

            io.of("/user").sockets.forEach(socket => {
                const socketUser = socket.data.user as User;

                if (userIds?.includes(socketUser?.id) && socketUser?.id !== user.id) {
                    socket.emit("user-stopped-typing", ({ roomId: roomId, userId: user.id }));
                }
            });
        });
    });
};
