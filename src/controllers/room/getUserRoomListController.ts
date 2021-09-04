import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { User } from "../../models/User";
import { IUserChatMate } from "../../repository/user/getUserChatMates";
import { getUserRoomsChatMates } from "../../repository/user/getUserRoomsChatMates";
import {
    getUserRoomsWithLatestMessage,
    IUserRoomWithLatestMessage,
} from "../../repository/user/getUserRoomsWithLatestMessage";
import { pluck } from "../../utils/pluck";

export const getUserRoomListController = async (
    req: Request,
    res: Response
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const user = res.locals.user as User;

    let rooms = await getUserRoomsWithLatestMessage(user.id);

    let chatMates = await getUserRoomsChatMates(
        user.id,
        pluck(rooms, "room_id")
    );

    rooms = rooms.map((room) => {
        const users = chatMates.filter((mate) => mate.room_id === room.room_id);

        return {
            ...room,
            users: users,
            room_name: parseRoomName(room, users, user.id),
            user_count: users.length + 1,
        };
    });

    res.json(rooms);
};

const parseRoomName = (
    room: IUserRoomWithLatestMessage,
    chatMates: IUserChatMate[],
    authUserId: number
) => {
    if (room.room_name) {
        return room.room_name;
    }

    return chatMates
        .filter((mate) => {
            return mate.id !== authUserId;
        })
        .map((mate) => {
            return `${mate.first_name} ${mate.last_name}`;
        })
        .join(", ");
};
