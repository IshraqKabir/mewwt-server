import { io } from "..";
import { wsAuth } from "./middlewares/wsAuth";

export const initIo = () => {
    io.use(wsAuth);

    io.on("connection", (socket) => {
        console.log(
            `${socket.data.user?.id}.${socket.data.user?.first_name} connected`
        );
    });
};
