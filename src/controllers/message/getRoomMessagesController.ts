import { Request, Response } from "express";
import { param, query } from "express-validator";
import { Room } from "../../models/Room";
import { getRoomMessages } from "../../repository/message/getRoomMessages";
import { checkErrors } from "../../utils/checkErrors";
import { getOffset } from "../../utils/getOffset";

export const getRoomMessagesValidator = [
    param("roomId").exists().toInt(),
    query("page").optional().isInt().trim().escape(),
];

export const getRoomMessagesController = async (req: Request, res: Response) => {
    checkErrors(req, res);

    const room = res.locals.room as Room;

    const { page } = req.query;

    const offset = getOffset(parseInt(page as string));

    const messages = await getRoomMessages(room.id, offset);

    res.json(messages);
};
