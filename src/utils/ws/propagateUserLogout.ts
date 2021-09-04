import { io, userSpaces } from "../..";
import { User } from "../../models/User";

export const propagateUserLogout = async (user: User) => {
    const socketIds: string[] = [];

    const sockets = io.of(`/user`).sockets;

    sockets.forEach((socket) => {
        const socketUser = socket.data.user as User;

        if (socketUser.id === user.id) {
            socketIds.push(socket.id);
        }
    });

    userSpaces.emit("logout", {
        userId: user.id,
        socketIds: socketIds,
    });
};
