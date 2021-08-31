import { Redis } from "ioredis";
import { IUserDisconnectedSocket } from "../../types/IUserOfflineSocket";

export const getUserOfflineSockets = async (
    userId: number,
    redis: Redis
): Promise<IUserDisconnectedSocket[]> => {
    const USER_OFFLINE_SOCKETS_KEY = `user-${userId}-offline-sockets`;

    return JSON.parse(
        (await redis.get(USER_OFFLINE_SOCKETS_KEY)) ?? "[]"
    ) as IUserDisconnectedSocket[];
};
