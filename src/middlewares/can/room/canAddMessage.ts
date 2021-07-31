import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { UNAUTHORIZED } from "../../../config/consts";
import { Room } from "../../../models/Room";
import { User } from "../../../models/User";
import { pluck } from "../../../utils/pluck";

export const canAddMessage = async (req: Request, res: Response, next: Function, roomRelations?: string[]) => {
    const user = res.locals.user as User;

    const { roomId } = req.body;

    if (!roomId) {
        return res.status(422).json("No roomId found");
    }

    const room = await getConnection().manager.findOne(Room, {
        where: {
            id: roomId
        },
        relations: roomRelations ? [ "users", ...roomRelations ] : [ "users" ]
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


