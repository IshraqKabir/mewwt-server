import { Request, Response } from "express";
import { check } from "express-validator";
import { getConnection } from "typeorm";
import { roomSpaces, userSpaces } from "../..";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { IUserRoomWithLatestMessage } from "../../repository/user/getUserRoomsWithLatestMessage";
import { checkErrors } from "../../utils/checkErrors";
import { getRoomName } from "../../utils/getRoomName";

export const createMessageValidation = [
    check("messageText").isLength({ min: 1 }).trim().escape(),
    check("roomId").isInt().escape(),
];

export const createMessageController = async (req: Request, res: Response) => {
    checkErrors(req, res);

    const room = res.locals.room as Room;
    const user = res.locals.user as User;

    const { messageText, } = req.body;

    const message = new Message();

    message.text = messageText;
    message.sender_id = user.id;
    message.room_id = room.id;

    await message.save();

    propagateMessage(message, user.id);

    res.json(message);
};

const propagateMessage = async (message: Message, authUserId: number) => {
    // io.of(`room-${room.id}`).emit("message");
    roomSpaces.to(`room-${message.room_id}`).emit("message", message);

    const room = await getConnection()
        .getRepository(Room)
        .findOne({
            where: {
                id: message.room_id,
            },
            relations: [ "users" ]
        });

    room?.users?.forEach((user) => {
        userSpaces.to(`user-${user.id}`).emit("message", {
            room_id: room.id,
            room_name: room.name ? room.name : getRoomName(room, user.id),
            sender_first_name: user.first_name,
            sender_last_name: user.last_name,
            message_created_at: message.created_at,
            sender_email: user.email,
            sender_id: user.id,
            message_text: message.text,
        } as IUserRoomWithLatestMessage);
    });
};
