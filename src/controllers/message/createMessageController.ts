import { Request, Response } from "express";
import { check } from "express-validator";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { checkErrors } from "../../utils/checkErrors";
import { propagateMessage } from "../../utils/ws/propagateMessage";

export const createMessageValidation = [
    check("messageText").isLength({ min: 1 }).trim().escape(),
    check("roomId").isInt().escape(),
];

export const createMessageController = async (req: Request, res: Response) => {
    checkErrors(req, res);

    const room = res.locals.room as Room;
    const user = res.locals.user as User;

    const { messageText } = req.body;

    const message = new Message();

    message.text = messageText;
    message.sender_id = user.id;
    message.room_id = room.id;

    await message.save();

    propagateMessage(message);

    res.json(message);
};
