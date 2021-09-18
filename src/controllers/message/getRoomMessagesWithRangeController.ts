import { Request, Response } from "express";
import { param, query, validationResult } from "express-validator";
import { Room } from "../../models/Room";
import { getRoomMessagesWithRange } from "../../repository/message/getRoomMessagesWithRange";

export const getRoomMessagesWithRangeValidator = [
    param("roomId").exists().toInt(),
    query("start").isInt({ min: 1 }).trim().escape(),
    query("end").isInt({ min: 2 }).trim().escape(),

];

export const getRoomMessagesWithRangeController = async (
    req: Request,
    res: Response
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const room = res.locals.room as Room;

    const { start, end } = req.query;

    const messages = await getRoomMessagesWithRange(room.id, Number(start), Number(end));

    res.json(messages);
};
