import { getConnection } from "typeorm";
import { roomSpaces, userSpaces } from "../..";
import { Message } from "../../models/Message";
import { RoomUser } from "../../models/RoomUser";

const EVENT_NAME = "message_read";

export const propagateMessageRead = async (messages: Message[], authUserId: number) => {
    if (messages.length === 0) return;

    const roomId = messages[ 0 ].room_id;

    const data = {
        message_ids: messages.map(message => message.id),
        reader_id: authUserId,
        room_id: roomId
    };

    roomSpaces.to(`room-${roomId}`).emit(EVENT_NAME, data);

    const users = await getConnection()
        .createQueryBuilder(RoomUser, "ru")
        .select("ru.user_id", "id")
        .where("ru.room_id = :roomId", { roomId: roomId })
        .getRawMany();

    users?.forEach((user) => {
        userSpaces.to(`user-${user.id}`).emit(EVENT_NAME, data);
    });
};
