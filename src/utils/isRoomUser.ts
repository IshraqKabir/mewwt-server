import { getConnection } from "typeorm";
import { RoomUser } from "../models/RoomUser";
import { User } from "../models/User";
import { pluck } from "./pluck";

export const isRoomUser = async (roomId: number, user: User) => {
    const roomsUsers = await getConnection()
        .getRepository(RoomUser)
        .find({
            where: {
                room_id: roomId,
            },
        });

    if (!pluck<RoomUser>(roomsUsers, "user_id").includes(user.id)) {
        return false;
    }

    return true;
};
