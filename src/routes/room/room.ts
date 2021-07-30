import express from "express";
import { Request, Response } from "express-serve-static-core";
import { createRoomController, createRoomValidation } from "../../controllers/room/createRoomController";
import { getRoomUsersController } from "../../controllers/room/getRoomUsersController";
import { Auth } from "../../middlewares/auth";
import { canGetRoomUsers } from "../../middlewares/can/room/canGetRoomUsers";
import { usersExist } from "../../middlewares/is/usersExist";

const router = express.Router();

router.get('/:roomId/users',
    (req, res, next) => Auth(req, res, next, [ "rooms" ]),
    (req, res, next) => canGetRoomUsers(req, res, next, [ "users" ]),
    getRoomUsersController,
);

router.post('/create',
    createRoomValidation,
    (req: Request, res: Response, next: Function) => Auth(req, res, next, [ "rooms" ]),
    (req: Request, res: Response, next: Function) => usersExist(req, res, next),
    createRoomController,
);

export default router;
