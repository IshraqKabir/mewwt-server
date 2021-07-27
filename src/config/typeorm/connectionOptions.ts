import { ConnectionOptions } from "typeorm";
import { User } from "../../models/User";

export const connectionOptions: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "ishraqkabir",
    password: "password",
    database: "test",
    entities: [
        User,
    ],
    synchronize: true,
    logging: false,
}