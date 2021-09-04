import { Room } from "../models/Room";

export const getRoomName = (room: Room, authUserId: number) => {
    if (room.name) {
        return room.name;
    }

    return room.users
        .filter((user) => {
            return user.id !== authUserId;
        })
        .map((user) => {
            return `${user.first_name} ${user.last_name}`;
        })
        .join(", ");
};
