import { Request, Response } from "express";
import { check } from "express-validator";
import { getConnection } from "typeorm";
import { Room } from "../../models/Room";
import { RoomUser } from "../../models/RoomUser";
import { User } from "../../models/User";
import { checkErrors } from "../../utils/checkErrors";
import { pluck } from "../../utils/pluck";

export const createRoomValidation = [
    check('userIds').isArray({ min: 1, }),
    check("name").optional().isLength({ min: 1 }).trim().escape(),
];

export const createRoomController = async (req: Request, res: Response) => {
    checkErrors(req, res);

    const users = getUsers(res);

    const prevRoomId = await getPrevRoomId(users);

    if (prevRoomId) {
        return res.json({
            room_id: prevRoomId,
        });
    }

    const connection = getConnection();

    const room = new Room();

    if (req.body.name) {
        room.name = req.body.name;
    }

    await connection.manager.save(room);

    await connection.createQueryBuilder()
        .insert()
        .into(RoomUser)
        .values(users.map(user => {
            return {
                user_id: user.id,
                room_id: room.id
            };
        }))
        .execute();

    res.json({
        room_id: room.id
    });
};

const getUsers = (res: Response): User[] => {
    return [
        ...res.locals.users,
        res.locals.user
    ] as User[];
};

export const getPrevRoomId = async (users: User[]): Promise<number | null> => {
    const userIds = pluck(users, "id") as number[];

    const room = await getConnection()
        .createQueryBuilder()
        .select("ru2.room_id")
        // .addSelect("array_agg(ru2.user_id)", "users") // not required.
        .from(RoomUser, "ru1")
        .leftJoin(RoomUser, "ru2", "ru2.room_id = ru1.room_id")
        .where("ru1.user_id = :authUserId", { authUserId: userIds[ 0 ] })
        .groupBy("ru2.room_id")
        .having("(array_agg(ru2.user_id) <@ ARRAY [:...userIds]::integer[] and array_agg(ru2.user_id) @> ARRAY [:...userIds]::integer[])", { userIds: userIds })
        .getRawOne();

    return room?.ru2_room_id;
};

// getPrevRoomId alternate queries
// these work but are not that effecient imo
// const room = await getConnection()
//     .createQueryBuilder()
//     .from(subQuery => {
//         return subQuery
//             .select("t1.room_id")
//             .addSelect("count(user_id)", "final_users_count")
//             .from(subQuery => {
//                 return subQuery
//                     .from(RoomsUsers, "ru")
//                     .where("ru.user_id IN (:...userIds)", { userIds });
//             }, "t1")
//             .leftJoin(subQuery => {
//                 return subQuery
//                     .select("room_id")
//                     .addSelect("count(user_id)", "users_count")
//                     .from(RoomsUsers, "ru1")
//                     .groupBy("room_id");
//             }, "t2", "t2.room_id = t1.room_id")
//             .where("t2.users_count = :userCount", { userCount: userIds.length })
//             .groupBy("t1.room_id");
//     }, "t3")
//     .where("t3.final_users_count = :userCount", { userCount: userIds.length })
//     .getRawOne();

// const room = await getConnection()
//     .createQueryBuilder()
//     .select("ru2.room_id")
//     .addSelect("array_agg(ru2.user_id)")
//     .from(RoomsUsers, "ru1")
//     .leftJoin(RoomsUsers, "ru2", "ru2.room_id = ru1.room_id")
//     .where("ru1.user_id = :authUserId", { authUserId: userIds[ 0 ] })
//     .groupBy("ru2.room_id")
//     // .having("(array_agg(ru2.user_id) <@ ARRAY [:...userIds]::integer[] and array_agg(ru2.user_id) @> ARRAY [:...userIds]::integer[])", { userIds })
//     .getRawOne();

// console.log("room", room);

