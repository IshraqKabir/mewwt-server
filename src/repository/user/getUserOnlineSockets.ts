import { Redis } from "ioredis";
import { IUserOnlineSocket } from "../../types/IUserOnlineSocket";

export const getUserOnlineSockets = async (
    userId: number,
    redis: Redis
): Promise<IUserOnlineSocket[]> => {
    const USER_ONLINE_SOCKETS_KEY = `user-${userId}-online-sockets`;

    return JSON.parse(
        (await redis.get(USER_ONLINE_SOCKETS_KEY)) ?? "[]"
    ) as IUserOnlineSocket[];
};
