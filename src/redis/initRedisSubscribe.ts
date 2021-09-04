import Redis from "ioredis";
import { io, userSpaces } from "..";
const redis = new Redis();

export const initRedisSubscribe = () => {
    // redis
    redis.subscribe("logout", (err, count) => {
        if (err) {
            // console.error("Failed to subscribe", err.message);
        } else {
            console
                .log
                // `Subscribed successfully! This client is currently subscribed to ${count} channels.`
                ();
        }
    });

    redis.subscribe("login", (err, count) => {
        if (err) {
            // console.error("Failed to subscribe", err.message);
        } else {
            // `Subscribed successfully! This client is currently subscribed to ${count} channels.`
        }
    });

    redis.on("message", (channel, message) => {
        // console.log(`Received ${message} from ${channel}`);

        const data: {
            userId: number;
            socketId: string;
        } = JSON.parse(message);

        const socketIds: string[] = [];

        const sockets = io.of(`/user-${data.userId}`).sockets;

        sockets.forEach((socket) => {
            socketIds.push(socket.id);
        });

        if (channel === "login") {
            userSpaces.emit("login", {
                userId: data.userId,
                socketIds: socketIds,
            });
        } else if (channel === "logout") {
            userSpaces.emit("logout", {
                userId: data.userId,
                socketIds: socketIds,
            });
        }
    });
};
