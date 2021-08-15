import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Message } from "../../../models/Message";
import { Room } from "../../../models/Room";
import { User } from "../../../models/User";

// checks if messageIds are in room
// filters out the messages sent by the user
export const messagesInRoom = async (req: Request, res: Response, next: Function) => {
    const room = res.locals.room as Room;
    const user = res.locals.user as User;

    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length < 1 || !Number.isInteger(messageIds[ 0 ])) {
        return res.status(422).json("messageIds has to be an array of messageIds");
    }

    const messages = await getConnection()
        .createQueryBuilder(Message, "message")
        .where("(message.room_id = :roomId and message.id IN (:...messageIds) and message.sender_id != :authUserId)",
            { roomId: room.id, messageIds: messageIds, authUserId: user.id }
        )
        .getMany();

    res.locals.messages = messages;

    next();
};
