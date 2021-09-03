import { getConnection } from "typeorm";
import { roomSpaces, userSpaces } from "../..";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { IUserRoomWithLatestMessage } from "../../repository/user/getUserRoomsWithLatestMessage";
import { getRoomName } from "../getRoomName";

export const propagateMessage = async (message: Message, sender: User) => {
    // io.of(`room-${room.id}`).emit("message");
    roomSpaces.to(`room-${message.room_id}`).emit("message", message);

    const room = await getConnection()
        .getRepository(Room)
        .findOne({
            where: {
                id: message.room_id,
            },
            relations: ["users"],
        });

    room?.users?.forEach((user) => {
        userSpaces.to(`user-${user.id}`).emit("message", {
            room_id: room.id,
            room_name: room.name ? room.name : getRoomName(room, user.id),
            sender_first_name: sender.first_name,
            sender_last_name: sender.last_name,
            message_created_at: message.created_at,
            sender_email: sender.email,
            sender_id: message.sender_id,
            message_text: message.text,
            is_read: false,
            is_group: room.is_group,
        } as IUserRoomWithLatestMessage);
    });
};