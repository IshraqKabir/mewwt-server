import { Request, Response } from "express";
import { param, query } from "express-validator";
import { Room } from "../../models/Room";
import { getRoomMessages } from "../../repository/message/getRoomMessages";
import { getRoomName } from "../../utils/getRoomName";

export const getRoomDetailsValidation = [
    param("roomId").exists().toInt(),
    query("page").isEmpty().isInt().trim().escape(),
];

export const getRoomDetailsController = async (req: Request, res: Response) => {
    const room = res.locals.room as Room;

    const messages = await getRoomMessages(room.id, 0);

    room.name = getRoomName(room, res.locals.user.id);

    room.messages = messages;

    res.json(room);
};
