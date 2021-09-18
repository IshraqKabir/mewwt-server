import { io } from "..";
import { User } from "../models/User";
import { IRoomPresence } from "../types/IRoomPresence";

export const getRoomPresences = (roomId: number): IRoomPresence[] => {
    const userIds: number[] = [];

    io.of("room").sockets.forEach(socket => {
        const user = socket.data.user as User;

        socket.rooms.forEach((room) => {
            if (roomId === Number(room.split("-")[room.split("-").length - 1] ?? 0)) {
                if (!userIds.includes(user.id)) {
                    userIds.push(user.id);
                }
            }
        });
    });

    return userIds.map(userId => {
        return {
            userId: userId,
            isPresent: true,
            isTyping: false,
        };
    });
};