import { Request, Response } from "express";
import { createQueryBuilder, getConnection, getManager, getRepository } from "typeorm";
import { Room } from "../../models/Room";
import { RoomsUsers } from "../../models/RoomsUsers";
import { User } from "../../models/User";

export const getUserRoomsController = async (req: Request, res: Response) => {
    const user = res.locals.user as User;

    // const rooms = await getConnection()
    //     .getRepository(Room)
    //     .createQueryBuilder("room")
    //     .where("room.userId = userId", { userId: user.id })
    //     .getMany();

    const rooms = await getRepository(RoomsUsers)
        .findOne({
            where: {
                userId: user.id
            },
            relations: [ "users" ]
        });

    res.json(rooms);
};
