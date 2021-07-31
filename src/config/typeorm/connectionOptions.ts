import { ConnectionOptions } from "typeorm";
import { entities } from "./entities";

export const connectionOptions: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "ishraqkabir",
    password: "password",
    database: "chaenc",
    entities: entities,
    // dropSchema: true,
    synchronize: true,
    logging: false,
};