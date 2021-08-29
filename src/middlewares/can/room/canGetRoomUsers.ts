import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { UNAUTHENTICATED, UNAUTHORIZED } from "../../../config/consts";
import { Room } from "../../../models/Room";
import { User } from "../../../models/User";
import { pluck } from "../../../utils/pluck";

export const canGetRoomUsers = async (
    req: Request,
    res: Response,
    next: Function,
    roomRelations?: string[]
) => {
    const user = res.locals.user as User;

    const { roomId } = req.params;

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
