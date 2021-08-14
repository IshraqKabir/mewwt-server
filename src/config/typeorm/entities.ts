import { Message } from "../../models/Message";
import { MessageRead } from "../../models/MessageRead";
import { Room } from "../../models/Room";
import { RoomUser } from "../../models/RoomUser";
import { User } from "../../models/User";

export const entities = [
    User,
    Room,
    RoomUser,
    Message,
    MessageRead,
];