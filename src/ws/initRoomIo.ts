import { Namespace } from "socket.io";
import { Room } from "../models/Room";
import { User } from "../models/User";
import { wsAuth } from "./middlewares/wsAuth";
import { wsIsRoomUser } from "./middlewares/wsIsRoomUser";

export const initRoomIo = async (roomSpaces: Namespace) => {
    roomSpaces.use(wsAuth);
    roomSpaces.use(wsIsRoomUser);

    roomSpaces.on("connection", (socket) => {
        const user = socket.data.user as User;
        const room = socket.data.room as Room;

        console.log(`${user.first_name} has connected to room: ${room.id}`);

        socket.join(`room-${room.id}`);
    });
};
