import { Request, Response } from "express";
import { param } from "express-validator";
import { Room } from "../../models/Room";
import { getRoomName } from "../../utils/getRoomName";

export const getRoomDetailsValidation = [
    param("roomId").exists().toInt(),
];

export const getRoomDetailsController = (req: Request, res: Response) => {
    const room = res.locals.room as Room;

    room.name = getRoomName(room, res.locals.user.id);

    res.json(room);
};
