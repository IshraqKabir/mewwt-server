import { getConnection } from "typeorm";
import { Message } from "../models/Message";
import { MessageRead } from "../models/MessageRead";
import { User } from "../models/User";

export const getRoomMessagesQuery = async (roomId: number) => {
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
            "reply_to_message.id as reply_to_message_id",
            "reply_to_message.text as reply_to_message_text",
            "reply_to_message_sender.id as reply_to_message_sender_id",
            "reply_to_message_sender.first_name as reply_to_message_sender_first_name",
            "reply_to_message_sender.last_name as reply_to_message_sender_last_name"
        ])
        .addSelect("array_agg(message_read.reader_id)", "readerIds")
        .from(Message, "messages")
        .leftJoin(Message, "reply_to_message", "messages.reply_to_message_id = reply_to_message.id")
        .leftJoin(User, "reply_to_message_sender", "reply_to_message.sender_id = reply_to_message_sender.id")
        .leftJoin(User, "sender", "sender.id = messages.sender_id")
        .leftJoin(
            MessageRead,
            "message_read",
            "message_read.message_id = messages.id"
        )
        .where("messages.room_id = :roomId", { roomId: roomId })
        .groupBy("messages.id")
        .addGroupBy("messages.sender_id")
        .addGroupBy("messages.room_id")
        .addGroupBy("messages.created_at")
        .addGroupBy("sender.id")
        .addGroupBy("reply_to_message.id")
        .addGroupBy("reply_to_message_sender.id")
        .orderBy("messages.created_at", "DESC");

};
