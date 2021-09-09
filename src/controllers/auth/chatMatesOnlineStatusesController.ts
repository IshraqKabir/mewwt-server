import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { IUserOnlineStatus } from "../../types/IUserOnlineStatus";
import Redis from "ioredis";
import { IUserOnlineSocket } from "../../types/IUserOnlineSocket";
import { io } from "../..";
import { IUserDisconnectedSocket } from "../../types/IUserOfflineSocket";
import { Socket } from "socket.io";
import { User } from "../../models/User";

export const chatMatesOnlineStatusesValidation = [
    check("userIds").isArray({ min: 1 }),
];

// post request
export const chatMatesOnlineStatusesController = async (
    req: Request,
    res: Response
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const userIds = req.body.userIds as number[];

    const usersOnlineStatuses: { [userId: number]: IUserOnlineStatus; } = {};

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
        [userId: number]: IUserDisconnectedSocket[];
    } = {};

    usersDisconnectedSockets.forEach((sockets) => {
        if (!sockets[0]) return;

        usersDisconnectedeSocketsHash[sockets[0].userId] = sockets;
    });

    const allSockets = io.of(`/user`).sockets;

    userIds.forEach((userId) => {
        const sockets: Socket[] = [];

        allSockets.forEach((socket) => {
            const socketUser = socket.data.user as User;

            if (socketUser.id === userId) {
                sockets.push(socket);
            }
        });

        if (sockets.length > 0) {
            const socketIds: string[] = [];

            sockets.forEach((socket) => {
                socketIds.push(socket.id);
            });

            usersOnlineStatuses[userId] = {
                isOnline: true,
                userId,
                socketIds,
            };
        } else {
            usersOnlineStatuses[userId] = {
                isOnline: false,
                userId,
                socketIds: [],
                lastSeen: usersDisconnectedeSocketsHash[userId][0]
                    ? usersDisconnectedeSocketsHash[userId][0].loggedOutAt ??
                    undefined
                    : undefined,
            };
        }
    });

    res.json(usersOnlineStatuses);
};
