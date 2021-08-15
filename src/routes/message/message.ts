import express, { Request, Response } from "express";
import { createMessageController, createMessageValidator } from "../../controllers/message/createMessageController";
import { getRoomMessagesController, getRoomMessagesValidator } from "../../controllers/message/getRoomMessagesController";
import { readMessagesController, readMessagesValidator } from "../../controllers/message/readMessagesController";
import { Auth } from "../../middlewares/auth";
import { canAddMessage } from "../../middlewares/can/room/canAddMessage";
import { canGetRoomMessages } from "../../middlewares/can/room/canGetRoomMessages";
import { messagesInRoom } from "../../middlewares/is/message/messagesInRoom";
import { isRoomUserMiddleware } from "../../middlewares/is/room/isRoomUserMiddleware";

const router = express.Router();

router.get('/room/:roomId/messages',
    getRoomMessagesValidator,
    (req: Request, res: Response, next: Function) => Auth(req, res, next),
    (req: Request, res: Response, next: Function) => canGetRoomMessages(req, res, next),
    getRoomMessagesController,
);

router.post('/send',
    createMessageValidator,
    (req: Request, res: Response, next: Function) => Auth(req, res, next),
    (req: Request, res: Response, next: Function) => canAddMessage(req, res, next),
    createMessageController,
);

router.post('/messages/read',
    readMessagesValidator,
    (req: Request, res: Response, next: Function) => Auth(req, res, next),
    (req: Request, res: Response, next: Function) => isRoomUserMiddleware(req, res, next),
    (req: Request, res: Response, next: Function) => messagesInRoom(req, res, next),
    readMessagesController,
);

export default router;
