import "reflect-metadata";
import express from "express";
import cors from "cors";

import auth from "./routes/user/auth";
import { createConnection } from "typeorm";
import { connectionOptions } from "./config/typeorm/connectionOptions";
import { PORT } from "./config/consts";

const main = async () => {
    const app = express();

    await createConnection(connectionOptions);

    app.use(cors({
        origin: "*",
        credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use('/api/auth', auth);

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

};

main();