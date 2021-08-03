import express, { Request, Response } from "express";
import { createRoomController, createRoomValidation } from "../../controllers/room/createRoomController";
import { getRoomUsersController, getRoomUsersValidator } from "../../controllers/room/getRoomUsersController";
import { getUserRoomsController } from "../../controllers/room/getUserRoomsController";
import { Auth } from "../../middlewares/auth";
import { canGetRoomUsers } from "../../middlewares/can/room/canGetRoomUsers";
import { usersExist } from "../../middlewares/is/usersExist";

const router = express.Router();

router.get('/:roomId/users',
    getRoomUsersValidator,
    (req: Request, res: Response, next: Function) => Auth(req, res, next),
    (req: Request, res: Response, next: Function) => canGetRoomUsers(req, res, next),
    getRoomUsersController,
);

router.post('/create',
    createRoomValidation,
    (req: Request, res: Response, next: Function) => Auth(req, res, next),
    (req: Request, res: Response, next: Function) => usersExist(req, res, next,),
    createRoomController,
);

router.get('/user/rooms',
    (req, res, next) => Auth(req, res, next),
    getUserRoomsController,
);

export default router;
