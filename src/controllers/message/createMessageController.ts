import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { SUCCESSFUL_RESPONSE } from "../../config/consts";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { User } from "../../models/User";

export const createMessageValidation = [
    check("messageText").isLength({ min: 1 }),
    check("roomId").isInt(),
];

export const createMessageController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const room = res.locals.room as Room;
    const user = res.locals.user as User;

    const { messageText } = req.body;

    await getConnection()
        .getRepository(Message)
        .createQueryBuilder()
        .insert()
        .values({
            text: messageText,
            sender_id: user.id,
            room_id: room.id
        })
        .execute();

    res.json(SUCCESSFUL_RESPONSE);
};
