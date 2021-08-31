import { Request, Response } from "express";
import { param, validationResult } from "express-validator";
import { Room } from "../../models/Room";
import { getRoomMessages } from "../../repository/message/getRoomMessages";
import { getRoomName } from "../../utils/getRoomName";

export const getRoomDetailsValidation = [param("roomId").exists().toInt()];

export const getRoomDetailsController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const room = res.locals.room as Room;

    const messages = await getRoomMessages(room.id, 0);

    room.name = getRoomName(room, res.locals.user.id);

    room.messages = messages;

    res.json(room);
};
