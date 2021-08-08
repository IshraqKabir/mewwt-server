import { Socket } from "socket.io";
import { getConnection } from "typeorm";
import { UNAUTHORIZED } from "../../config/consts";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { pluck } from "../../utils/pluck";

export const wsIsRoomUser = async (socket: Socket, next: Function) => {
    const { name } = socket.nsp;

    const user = socket.data.user as User;

    const roomId = name.split("-")[ name.split("-").length - 1 ];

    const room = await getConnection()
        .getRepository(Room)
        .findOne({
            where: {
                id: roomId
            },
            relations: [ "users" ]
        });

    if (!room) {
        next(new Error(UNAUTHORIZED));
        socket.disconnect();
    }

    if (room && !pluck(room.users, "id").includes(user.id)) {
        next(new Error(UNAUTHORIZED));
        socket.disconnect();
    }

    socket.data.room = room;

    next();
};
