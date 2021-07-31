import express, { Request, Response } from "express";
import { createMessageController, createMessageValidation } from "../../controllers/message/createMessageController";
import { getRoomMessagesController } from "../../controllers/message/getRoomMessagesController";
import { Auth } from "../../middlewares/auth";
import { canAddMessage } from "../../middlewares/can/room/canAddMessage";
import { canGetRoomMessages } from "../../middlewares/can/room/canGetRoomMessages";

const router = express.Router();

router.get('/room/:roomId/messages',
    (req, res, next) => Auth(req, res, next),
    (req, res, next) => canGetRoomMessages(req, res, next),
    getRoomMessagesController,
);

router.post('/send',
    createMessageValidation,
    (req: Request, res: Response, next: Function) => Auth(req, res, next),
    (req: Request, res: Response, next: Function) => canAddMessage(req, res, next),
    createMessageController,
);

export default router;
