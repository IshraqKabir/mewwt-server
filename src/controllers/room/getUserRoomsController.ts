import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { getRepository } from "typeorm";
import { RoomUser } from "../../models/RoomUser";
import { User } from "../../models/User";

export const getUserRoomsController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const user = res.locals.user as User;

    const rooms = await getRepository(RoomUser)
        .findOne({
            where: {
                userId: user.id
            },
            relations: [ "users" ]
        });

    res.json(rooms);
};
