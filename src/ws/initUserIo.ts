import { Namespace } from "socket.io";
import { io } from "..";
import {
    CONNECTION,
    DISCONNECT,
    KNOW_USERS_STATUSES,
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    USER_ONLINE_STATUSES,
} from "../config/consts";
import { User } from "../models/User";
import { IUserOnlineStatus } from "../types/IUserOnlineStatus";
import { pluck } from "../utils/pluck";
import { wsAuth } from "./middlewares/wsAuth";
import { wsCheckUser } from "./middlewares/wsCheckUser";

export const initUserIo = async (userSpaces: Namespace) => {
    userSpaces.use(wsAuth);
    userSpaces.use(wsCheckUser);

    userSpaces.on(CONNECTION, (socket) => {
        const user = socket.data.user as User;

        socket.on(KNOW_USERS_STATUSES, (data: number[]) => {
            console.log(`${KNOW_USERS_STATUSES} data received on server`, data);

            const userOnlineStatuses: IUserOnlineStatus[] = [];

            data.forEach((userId) => {
                io.of(`user-${userId}`).sockets.forEach((socket) => {
                    userOnlineStatuses.push({
                        userId,
                        isOnline: true,
                    });
                });
            });

            data.filter(
                (userId) =>
                    !pluck(userOnlineStatuses, "userId").includes(userId)
            ).forEach((userId) => {
                userOnlineStatuses.push({
                    userId: userId,
                    isOnline: false,
                });
            });

            socket.emit(USER_ONLINE_STATUSES, userOnlineStatuses);
        });

        // socket.on(DISCONNECT, () => {
        //     console.log(`${user.id}: ${user.first_name} has disconnected`);
        // });

        socket.join(`user-${user.id}`);
    });
};
