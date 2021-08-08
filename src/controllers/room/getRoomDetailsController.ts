import { Request, Response } from "express";
import { param } from "express-validator";
import { getConnection } from "typeorm";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { getRoomName } from "../../utils/getRoomName";

export const getRoomDetailsValidation = [
    param("roomId").exists().toInt(),
];

export const getRoomDetailsController = async (req: Request, res: Response) => {
    const room = res.locals.room as Room;

    const messages = await getConnection()
        .createQueryBuilder(Message, "message")
        .leftJoinAndSelect("message.sender", "sender")
        .where("message.room_id = :roomId", { roomId: room.id })
        .orderBy("message.created_at", "DESC")
        .limit(20)
        .getMany();

    room.name = getRoomName(room, res.locals.user.id);
    room.messages = messages;

    res.json(room);
};
