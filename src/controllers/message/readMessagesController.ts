import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { Message } from "../../models/Message";
import { MessageRead } from "../../models/MessageRead";
import { User } from "../../models/User";
import { propagateMessageRead } from "../../utils/ws/propagateMessagesRead";

export const readMessagesValidator = [
    check('messageIds').isArray({ min: 1 }),
    check("roomId").isInt().escape(),
];

export const readMessagesController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const messages = res.locals.messages as Message[];
    const user = res.locals.user as User;

    if (messages.length !== 0) {
        getConnection()
            .createQueryBuilder()
            .insert()
            .into(MessageRead)
            .values(messages.map(message => {
                return {
                    reader_id: user.id,
                    message_id: message.id
                };
            }))
            .onConflict(`("reader_id", "message_id") DO NOTHING`)
            .execute();

        propagateMessageRead(messages, user.id);
    }


    res.json("ok");
};
