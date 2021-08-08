import { Request, Response } from "express";
import { check } from "express-validator";
import { getConnection } from "typeorm";
import { Room } from "../../models/Room";
import { RoomsUsers } from "../../models/RoomsUsers";
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
        .into(RoomsUsers)
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
    const userIds = pluck(users, "id");

    const room = await getConnection()
        .createQueryBuilder()
        .from(subQuery => {
            return subQuery
                .select("room_id")
                .addSelect("count(room_id)", "c")
                .from(RoomsUsers, "ru")
                .where("user_id IN (:...userIds)", { userIds: userIds })
                .groupBy("room_id");
        }, "ru")
        .where("ru.c = :userCount", { userCount: userIds.length })
        .getRawOne();

    return room?.room_id;
};
