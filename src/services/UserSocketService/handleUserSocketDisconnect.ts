import { Socket } from "socket.io";
import Redis from "ioredis";
import { User } from "../../models/User";
import { IUserOnlineSocket } from "../../types/IUserOnlineSocket";
import { IUserDisconnectedSocket } from "../../types/IUserOfflineSocket";
import { getUserOnlineSockets } from "../../repository/user/getUserOnlineSockets";
import { getUserOfflineSockets } from "../../repository/user/getUserOfflineSockets";
import { io, userSpaces } from "../..";

export const handleUserSocketDisconnect = async (
    user: User,
    socket: Socket
) => {
    const USER_ONLINE_SOCKETS_KEY = `user-${user.id}-online-sockets`;
    const USER_OFFLINE_SOCKETS_KEY = `user-${user.id}-offline-sockets`;

    const redis = new Redis();

    const userOnlineSockets = await getUserOnlineSockets(user.id, redis);

    redis
        .multi()
        .set(
            USER_ONLINE_SOCKETS_KEY,
            JSON.stringify([
                ...userOnlineSockets.filter((onlineSocket) => {
                    return onlineSocket.socketId !== socket.id;
                }),
            ] as IUserOnlineSocket[])
        )
        .set(
            USER_OFFLINE_SOCKETS_KEY,
            JSON.stringify([
                {
                    userId: user.id,
                    socketId: socket.id,
                    loggedInAt:
                        userOnlineSockets.find(
                            (userSocket) => userSocket.socketId === socket.id
                        )?.loggedInAt ?? new Date(),
                    loggedOutAt: new Date(),
                },
            ] as IUserDisconnectedSocket[])
        )
        .exec();

    const socketIds: string[] = [];

    const sockets = io.of(`/user-${user.id}`).sockets;

    sockets.forEach((socket) => {
        socketIds.push(socket.id);
    });

    userSpaces.emit("logout", {
        userId: user.id,
        socketIds: socketIds,
    });

    // redis.publish(
    //     "logout",
    //     JSON.stringify({
    //         userId: user.id,
    //         socketId: socket.id,
    //     })
    // );
};
