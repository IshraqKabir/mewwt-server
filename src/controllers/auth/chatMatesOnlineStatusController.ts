import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { IUserOnlineStatus } from "../../types/IUserOnlineStatus";
import Redis from "ioredis";
import { IUserOnlineSocket } from "../../types/IUserOnlineSocket";
import { io } from "../..";
import { IUserDisconnectedSocket } from "../../types/IUserOfflineSocket";

export const chatMatesOnlineStatusValidation = [
    check("userIds").isArray({ min: 1 }),
];

// post request
export const chatMatesOnlineStatusController = async (
    req: Request,
    res: Response
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const userIds = req.body.userIds as number[];

    const usersOnlineStatuses: IUserOnlineStatus[] = [];

    const redisInstance = new Redis();

    const redis = redisInstance.multi();

    userIds.forEach((userId) => {
        redis.get(`user-${userId}-offline-sockets`);
    });

    const results = await redis.exec();

    let usersDisconnectedSockets =
        (results?.map((result) => {
            return JSON.parse(result[1] ?? "[]");
        }) as [IUserDisconnectedSocket[]]) ?? [];

    const usersDisconnectedeSocketsHash: {
        [userId: number]: IUserOnlineSocket[];
    } = {};

    usersDisconnectedSockets.forEach((sockets) => {
        if (!sockets[0]) return;

        usersDisconnectedeSocketsHash[sockets[0].userId] = sockets;
    });

    userIds.forEach((userId) => {
        if (io.of(`/user-${userId}`).sockets.size > 0) {
            usersOnlineStatuses.push({
                isOnline: true,
                userId,
            });
        } else {
            usersOnlineStatuses.push({
                isOnline: false,
                userId,
                lastSeen: usersDisconnectedSockets[userId]
                    ? usersDisconnectedSockets[userId][0]?.loggedOutAt ??
                      new Date()
                    : new Date(),
            });
        }
    });

    res.json(usersOnlineStatuses);
};
