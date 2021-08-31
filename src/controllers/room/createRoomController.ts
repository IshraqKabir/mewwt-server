import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { Message } from "../../models/Message";
import { Room } from "../../models/Room";
import { RoomUser } from "../../models/RoomUser";
import { User } from "../../models/User";
import { pluck } from "../../utils/pluck";
import { propagateMessage } from "../../utils/ws/propagateMessage";

export const createRoomValidation = [
    check("userIds").isArray({ min: 1 }),
    check("name").optional().isLength({ min: 1 }).trim().escape(),
    check("isGroup").optional().isBoolean(),
];

export const createRoomController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const users = getUsers(res);
    const user = res.locals.user as User;

    if (!req.body.isGroup) {
        const prevRoomId = await getPrevRoomId(users);

        if (prevRoomId) {
            return res.json({
                room_id: prevRoomId,
            });
        }
    }

    const connection = getConnection();

    const room = new Room();
    room.is_group = !!req.body.isGroup;

    if (req.body.name) {
        room.name = req.body.name;
    }

    await connection.manager.save(room);

    await connection
        .createQueryBuilder()
        .insert()
        .into(RoomUser)
        .values(
            users.map((user) => {
                return {
                    user_id: user.id,
                    room_id: room.id,
                };
            })
        )
        .execute();

    const message = new Message();
    message.room_id = room.id;

    propagateMessage(message, user);

    res.json({
        room_id: room.id,
    });
};

const getUsers = (res: Response): User[] => {
    return [...res.locals.users, res.locals.user] as User[];
};

export const getPrevRoomId = async (users: User[]): Promise<number | null> => {
    const userIds = pluck(users, "id") as number[];

    const room = await getConnection()
        .createQueryBuilder()
        .select("ru2.room_id")
        // .addSelect("array_agg(ru2.user_id)", "users") // not required.
        .from(RoomUser, "ru1")
        .leftJoin(RoomUser, "ru2", "ru2.room_id = ru1.room_id")
        .where("ru1.user_id = :authUserId", { authUserId: userIds[0] })
        .groupBy("ru2.room_id")
        .having(
            "(array_agg(ru2.user_id) <@ ARRAY [:...userIds]::integer[] and array_agg(ru2.user_id) @> ARRAY [:...userIds]::integer[])",
            { userIds: userIds }
        )
        .getRawOne();

    return room?.ru2_room_id;
};
