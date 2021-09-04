import { Socket } from "socket.io";
import { UNAUTHORIZED } from "../../config/consts";
import { User } from "../../models/User";

export const wsCheckUser = async (socket: Socket, next: Function) => {
    const { name } = socket.nsp;

    const user = socket.data.user as User;

    const userId = name.split("-")[name.split("-").length - 1];

    if (parseInt(userId) !== user.id) {
        console.log("failed ws check user");
        next(new Error(UNAUTHORIZED));
        socket.disconnect();
    }

    console.log("passed ws check user");

    next();
};
