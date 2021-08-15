import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { RoomUser } from "../../models/RoomUser";
import { User } from "../../models/User";
import { checkErrors } from "../../utils/checkErrors";

export const getUserRoomsController = async (req: Request, res: Response) => {
    checkErrors(req, res);

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
