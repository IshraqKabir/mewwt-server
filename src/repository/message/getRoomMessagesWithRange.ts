import { getRoomMessagesQuery } from "../../queries/getRoomMessagesQuery";

export const getRoomMessagesWithRange = async (roomId: number, start: number, end: number) => {
    const query = await getRoomMessagesQuery(roomId);

    const result = await query
        .where('messages.id > :start and messages.id <= :end', { start, end })
        .getRawMany();

    return result;
};
