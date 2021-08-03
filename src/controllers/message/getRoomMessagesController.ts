import { Request, Response } from "express";
import { param } from "express-validator";
import { getConnection } from "typeorm";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";

export const getRoomMessagesValidator = [ param("roomId").exists().toInt() ];

export const getRoomMessagesController = async (req: Request, res: Response) => {
    const room = res.locals.room as Room;

    const messages = await getConnection()
        .manager
        .find(Message, {
            where: {
                room_id: room.id
            },
            "relations": [ "sender" ],
            "order": {
                "created_at": "DESC",
            }
        });

    res.json(messages);
};
