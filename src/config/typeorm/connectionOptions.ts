import { ConnectionOptions } from "typeorm";

export const connectionOptions: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "ishraqkabir",
    password: "password",
    database: "test",
    entities: [
    ],
    synchronize: true,
    logging: true,
}