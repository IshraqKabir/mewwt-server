import express from "express";
import { getRoomUsersController } from "../../controllers/room/getRoomUsersController";
import { Auth } from "../../middlewares/auth";
import { canGetRoomUsers } from "../../middlewares/can/room/canGetRoomUsers";

const router = express.Router();

router.get('/:roomId/users',
    (req, res, next) => Auth(req, res, next),
    (req, res, next) => canGetRoomUsers(req, res, next, [ "users" ]),
    getRoomUsersController,
);

// router.post('/create');

export default router;
