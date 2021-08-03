import { Request, Response } from "express";
import { check } from "express-validator";
import { getConnection } from "typeorm";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { checkErrors } from "../../utils/checkErrors";
import { SUCCESSFUL_RESPONSE } from "../../config/consts";

export const createMessageValidation = [
    check("messageText").isLength({ min: 1 }).trim().escape(),
    check("roomId").isInt(),
];

export const createMessageController = async (req: Request, res: Response) => {
    checkErrors(req, res);

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
