import { getConnection } from "typeorm";
import { Message } from "../../models/Message";
import { MessageRead } from "../../models/MessageRead";
import { User } from "../../models/User";

export const getRoomMessages = async (roomId: number, offset: number) => {
    return await getConnection()
        .createQueryBuilder()
        .select([
            "messages.id as id",
            "messages.text as text",
            "messages.sender_id as sender_id",
            "messages.room_id as room_id",
            "messages.created_at as created_at",
            "sender.id as sender_id",
            "sender.first_name as sender_first_name",
            "sender.last_name as sender_last_name",
        ])
        .addSelect("array_agg(message_read.reader_id)", "readerIds")
        .from(Message, "messages")
        .leftJoin(User, "sender", "sender.id = messages.sender_id")
        .leftJoin(
            MessageRead,
            "message_read",
            "message_read.message_id = messages.id"
        )
        .where("messages.room_id = :roomId", { roomId: roomId })
        .groupBy("messages.id")
        .addGroupBy("messages.text")
        .addGroupBy("messages.sender_id")
        .addGroupBy("messages.room_id")
        .addGroupBy("messages.created_at")
        .addGroupBy("sender.id")
        .addGroupBy("sender.first_name")
        .addGroupBy("sender.last_name")
        .orderBy("messages.created_at", "DESC")
        .offset(offset)
        .limit(20)
        .getRawMany();
};
