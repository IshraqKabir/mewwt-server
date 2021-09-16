import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { IReplyTo } from "../../types/IReplyTo";
import { propagateMessage } from "../../utils/ws/propagateMessage";

export const createMessageValidator = [
    check("messageText").isLength({ min: 1 }).trim().escape(),
    check("reply_to_message_id").optional().isInt().escape(),
    check("roomId").isInt().escape(),
];

export const createMessageController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const room = res.locals.room as Room;
    const user = res.locals.user as User;

    const { messageText, reply_to_message_id } = req.body;

    const message = new Message();

    message.text = messageText;
    message.sender_id = user.id;
    message.room_id = room.id;

    const reply_to_message = await getConnection().manager.findOne(Message, {
        where: {
            id: reply_to_message_id ?? 0
        },
        relations: ["sender"]
    });

    if (reply_to_message && reply_to_message.room_id === room.id) {
        message.reply_to_message_id = reply_to_message_id;
    }

    await message.save();

    if (reply_to_message) {
        propagateMessage(message, user, {
            reply_to_message_id: reply_to_message.id,
            reply_to_message_sender_id: reply_to_message.sender?.id,
            reply_to_message_sender_first_name: reply_to_message.sender?.first_name,
            reply_to_message_sender_last_name: reply_to_message.sender?.last_name,
            reply_to_message_text: reply_to_message.text
        });
    } else {
        propagateMessage(message, user);
    }

    if (reply_to_message) {
        res.json({
            ...message,
            reply_to_message_id: reply_to_message.id,
            reply_to_message_sender_id: reply_to_message.sender?.id,
            reply_to_message_sender_first_name: reply_to_message.sender?.first_name,
            reply_to_message_sender_last_name: reply_to_message.sender?.last_name,
            reply_to_message_text: reply_to_message.text
        } as (Message & IReplyTo));
    } else {
        res.json(message);
    }
};
