import { getRoomMessagesQuery } from "../../queries/getRoomMessagesQuery";

export const getRoomMessages = async (roomId: number, offset: number) => {
    const query = await getRoomMessagesQuery(roomId);

    const result = await query
        .offset(offset)
        .limit(20)
        .getRawMany();

    return result;
};
