import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { UNAUTHORIZED } from "../../../config/consts";
import { Room } from "../../../models/Room";
import { User } from "../../../models/User";
import { pluck } from "../../../utils/pluck";

export const isRoomUserMiddleware = async (
    req: Request,
    res: Response,
    next: Function,
    roomRelations = []
) => {
    const user = res.locals.user as User;

    const { roomId } =
        req[
            req.method === "POST"
                ? "body"
                : req.method === "GET"
                ? "params"
                : "body"
        ];

    if (!roomId) {
        res.status(422).json("No roomId found");
        res.end();
        return;
    }

    const room = await getConnection().manager.findOne(Room, {
        where: {
            id: roomId,
        },
        relations: roomRelations ? ["users", ...roomRelations] : ["users"],
    });

    if (!room) {
        res.status(404).json("Room not found");
        res.end();
        return;
    }

    if (!pluck(room.users, "id").includes(user.id)) {
        res.status(403).json(UNAUTHORIZED);
        res.end();
        return;
    }

    res.locals.room = room;

    next();
};
