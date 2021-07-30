import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { UNAUTHENTICATED, UNAUTHORIZED } from "../../../config/consts";
import { Room } from "../../../models/Room";
import { pluck } from "../../../utils/pluck";

export const canGetRoomUsers = async (req: Request, res: Response, next: Function, roomRelations?: string[]) => {
    const { user } = res.locals;

    if (!user) {
        return res.status(401).json(UNAUTHENTICATED);
    }

    const { roomId } = req.params;

    if (!roomId) {
        return res.status(422).json("No roomId found");
    }

    const room = await getConnection().manager.findOne(Room, {
        where: {
            id: roomId
        },
        relations: roomRelations
    });


    if (!room) {
        return res.status(404).json("Room not found");
    }

    if (!pluck(room.users, "id").includes(user.id)) {
        return res.status(403).json(UNAUTHORIZED);
    }

    res.locals.room = room;

    next();
};


