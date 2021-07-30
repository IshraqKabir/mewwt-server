import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { Room } from "../../models/Room";

export const createRoomValidation = [
    check('userIds').isArray({ min: 2 }),
    check("name").optional().isLength({ min: 1 }),
];

export const createRoomController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { users } = res.locals;

    const connection = getConnection();

    const room = new Room();
    if (req.body.name) {
        room.name = req.body.name;
    }
    room.users = users;

    await connection.manager.save(room);

    res.json(room);
};
