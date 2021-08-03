import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { RoomsUsers } from "../../models/RoomsUsers";
import { User } from "../../models/User";

export const getUserRoomsController = async (req: Request, res: Response) => {
    const user = res.locals.user as User;


    const rooms = await getRepository(RoomsUsers)
        .findOne({
            where: {
                userId: user.id
            },
            relations: [ "users" ]
        });

    res.json(rooms);
};
