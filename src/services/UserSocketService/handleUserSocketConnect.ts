import { Socket } from "socket.io";
import Redis from "ioredis";
import { User } from "../../models/User";
import { IUserOnlineSocket } from "../../types/IUserOnlineSocket";
import { pluck } from "../../utils/pluck";
import { propagateUserLogin } from "../../utils/ws/propagateUserLogin";

export const handleUserSocketConnect = async (user: User, socket: Socket) => {
    const REDIS_KEY_FOR_USER = `user-${user.id}-online-sockets`;

    const redis = new Redis();

    const userOnlineSockets = JSON.parse(
        (await redis.get(REDIS_KEY_FOR_USER)) ?? "[]"
    ) as IUserOnlineSocket[];

    if (!pluck(userOnlineSockets, "socketId").includes(socket.id)) {
        redis.set(
            `user-${user.id}-online-sockets`,
            JSON.stringify([
                {
                    userId: user.id,
                    socketId: socket.id,
                    loggedInAt: new Date(),
                },
                ...userOnlineSockets,
            ] as IUserOnlineSocket[])
        );
    }

    propagateUserLogin(user);
};
