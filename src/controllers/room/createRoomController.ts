import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { Room } from "../../models/Room";
import { RoomsUsers } from "../../models/RoomsUsers";
import { User } from "../../models/User";

export const createRoomValidation = [
    check('userIds').isArray({ min: 2 }),
    check("name").optional().isLength({ min: 1 }),
];

export const createRoomController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const users = res.locals.users as User[];

    const connection = getConnection();

    const room = new Room();

    if (req.body.name) {
        room.name = req.body.name;
    }

    await connection.manager.save(room);

    await connection.createQueryBuilder()
        .insert()
        .into(RoomsUsers)
        .values(users.map(user => {
            return {
                user_id: user.id,
                room_id: room.id
            };
        }))
        .execute();

    res.json(room);
};
