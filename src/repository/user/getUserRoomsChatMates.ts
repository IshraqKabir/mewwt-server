import { getConnection } from "typeorm";
import { RoomsUsers } from "../../models/RoomsUsers";
import { User } from "../../models/User";

export interface IUserChatMate {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    room_id: number;
}

export const getUserRoomsChatMates = async (userId: number, roomIds: number[]): Promise<IUserChatMate[]> => {
    const result = await getConnection()
        .createQueryBuilder(RoomsUsers, "ru")
        .select([
            "ru.room_id as room_id",
            "u.id as id",
            "u.first_name as first_name",
            "u.last_name as last_name",
            "u.email as email",
        ])
        .innerJoin(qb => {
            return qb
                .from(RoomsUsers, "ru1")
                .where("ru1.user_id = :userId", { userId: userId, });
        }, "t1", "t1.room_id = ru.room_id")
        .leftJoin(User, "u", "ru.user_id = u.id")
        .where("ru.user_id != :userId", { userId: userId, })
        .andWhere("ru.room_id IN (:...roomIds)", { roomIds: roomIds })
        .getRawMany();

    return result;
};
