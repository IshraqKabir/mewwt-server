import { getConnection } from "typeorm";
import { Message } from "../../models/Message";
import { MessageRead } from "../../models/MessageRead";
import { Room } from "../../models/Room";
import { RoomUser } from "../../models/RoomUser";
import { User } from "../../models/User";

export interface IUserRoomWithLatestMessage {
    room_id: number;
    message_text: string;
    sender_id: number;
    sender_email: string;
    sender_first_name: string;
    sender_last_name: string;
    room_name: string;
    message_created_at: Date;
    is_read: boolean;
    message_id: number;
    user_count?: number;
}

export const getUserRoomsWithLatestMessage = async (userId: number): Promise<IUserRoomWithLatestMessage[]> => {
    const subQuery = getConnection()
        .createQueryBuilder(Message, "m")
        .select([]) // this is necessary for correct selection
        .addSelect("max(m.created_at)", "date")
        .where("m.room_id = ru.room_id");

    const roomsWithLatestMessage = await getConnection()
        .createQueryBuilder(RoomUser, "ru")
        .leftJoin(Room, "room", "ru.room_id = room.id")
        .select([
            "ru.room_id as room_id",
            "sender.id",
            "sender.first_name",
            "sender.last_name",
            "sender.email",
            "message.id as message_id",
            "message.text",
            "message.created_at",
            "room.name as room_name",
        ])
        .addSelect("array_agg(message_reads.reader_id) <@ ARRAY [:...userIds]::integer[]", "is_read")
        .addSelect("array_agg(message_reads.reader_id)", "readers")
        .setParameter("userIds", [ userId ])
        .leftJoin(Message, "message", `message.room_id = ru.room_id and message.created_at = (${subQuery.getQuery()})`)
        .leftJoin(MessageRead, "message_reads", "(message.id = message_reads.message_id and message_reads.reader_id = :userId )", { userId: userId })
        .leftJoin(User, "sender", "message.sender_id = sender.id")
        .where("ru.user_id = :userId", { userId: userId, })
        .groupBy("ru.room_id")
        .addGroupBy("ru.created_at")
        .addGroupBy("message.id")
        .addGroupBy("sender.id")
        .addGroupBy("sender.first_name")
        .addGroupBy("sender.last_name")
        .addGroupBy("sender.email")
        .addGroupBy("message.text")
        .addGroupBy("message.created_at")
        .addGroupBy("room.name")
        .orderBy("COALESCE(message.created_at, ru.created_at)", "DESC")
        .getRawMany();

    return roomsWithLatestMessage;
};
