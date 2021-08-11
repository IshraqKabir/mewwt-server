import { getConnection } from "typeorm";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { RoomsUsers } from "../../models/RoomsUsers";
import { User } from "../../models/User";

export interface IUserRoomWithLatestMessage {
    room_id: number;
    message_text: string;
    sender_id: number;
    sender_email: string;
    sender_first_name: string;
    sender_last_name: string;
    room_name: string;
}

export const getUserRoomsWithLatestMessage = async (userId: number): Promise<IUserRoomWithLatestMessage[]> => {
    const subQuery = getConnection()
        .createQueryBuilder(Message, "m")
        .select([]) // this is necessary for correct selection
        .addSelect("max(m.created_at)", "date")
        .where("m.room_id = ru.room_id");

    const roomsWithLatestMessage = await getConnection()
        .createQueryBuilder(RoomsUsers, "ru")
        .leftJoin(Room, "room", "ru.room_id = room.id")
        .select([
            "ru.room_id as room_id",
            "sender.id",
            "sender.first_name",
            "sender.last_name",
            "sender.email",
            "message.text",
            "room.name as room_name"
        ])
        .leftJoin(Message, "message", `message.room_id = ru.room_id and message.created_at = (${subQuery.getQuery()})`)
        .leftJoin(User, "sender", "message.sender_id = sender.id")
        .where("ru.user_id = :userId", { userId: userId, })
        .orderBy("COALESCE(message.created_at, ru.created_at)", "DESC")
        .getRawMany();

    return roomsWithLatestMessage;

};
