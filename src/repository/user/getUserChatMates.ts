import { getConnection } from "typeorm";
import { RoomUser } from "../../models/RoomUser";
import { User } from "../../models/User";

export interface IUserChatMate {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    room_id: number;
}

export const getUserChatMates = async (
    userId: number
): Promise<IUserChatMate[]> => {
    const result = await getConnection()
        .createQueryBuilder(RoomUser, "ru")
        .select([
            "u.id as id",
            "u.first_name as first_name",
            "u.last_name as last_name",
            "u.email as email",
        ])
        .innerJoin(
            (qb) => {
                return qb
                    .from(RoomUser, "ru1")
                    .where("ru1.user_id = :userId", { userId: userId });
            },
            "t1",
            "t1.room_id = ru.room_id"
        )
        .leftJoin(User, "u", "ru.user_id = u.id")
        .where("ru.user_id != :userId", { userId: userId })
        .distinctOn(["u.id"])
        .getRawMany();

    return result;
};
