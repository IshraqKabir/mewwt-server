import { Request, Response } from "express";
import { param } from "express-validator";
import { Room } from "../../models/Room";
import { getRoomMessages } from "../../repository/message/getRoomMessages";
import { checkErrors } from "../../utils/checkErrors";
import { getRoomName } from "../../utils/getRoomName";

export const getRoomDetailsValidation = [
    param("roomId").exists().toInt(),
];

export const getRoomDetailsController = async (req: Request, res: Response) => {
    checkErrors(req, res);

    const room = res.locals.room as Room;

    const messages = await getRoomMessages(room.id, 0);

    room.name = getRoomName(room, res.locals.user.id);

    room.messages = messages;

    res.json(room);
};
