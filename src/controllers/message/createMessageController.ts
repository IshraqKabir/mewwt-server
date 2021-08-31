import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { propagateMessage } from "../../utils/ws/propagateMessage";

export const createMessageValidator = [
    check("messageText").isLength({ min: 1 }).trim().escape(),
    check("roomId").isInt().escape(),
];

export const createMessageController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }


    const room = res.locals.room as Room;
    const user = res.locals.user as User;

    const { messageText } = req.body;

    const message = new Message();

    message.text = messageText;
    message.sender_id = user.id;
    message.room_id = room.id;

    await message.save();

    propagateMessage(message, user);

    res.json(message);
};
