import { ConnectionOptions } from "typeorm";
import { AuthToken } from "../../model/AuthToken";
import { User } from "../../model/User";

export const connectionOptions: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "ishraqkabir",
    password: "password",
    database: "test",
    entities: [
        User,
        AuthToken,
    ],
    synchronize: true,
    logging: false,
}