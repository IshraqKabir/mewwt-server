import express, { Request, Response } from "express";
import { Auth } from "../../middlewares/auth";
import {
    loginController,
    loginValidation,
} from "../../controllers/auth/loginController";
import {
    registerController,
    registerValidation,
} from "../../controllers/auth/registerController";
import { getUserChatMates } from "../../repository/user/getUserChatMates";
import {
    chatMatesOnlineStatusesController,
    chatMatesOnlineStatusesValidation,
} from "../../controllers/auth/chatMatesOnlineStatusesController";
import { check } from "express-validator";

const router = express.Router();

router.post("/login", loginValidation, async (req: Request, res: Response) => {
    await loginController(req, res);
});

router.post(
    "/register",
    registerValidation,
    async (req: Request, res: Response) => {
        await registerController(req, res);
    }
);

router.get(
    "/me",
    (req, res, next) => Auth(req, res, next),
    async (req, res) => {
        res.json(res.locals.user);
    }
);

router.get(
    "/chat-mates",
    (req, res, next) => Auth(req, res, next),
    async (req, res) => {
        res.json(await getUserChatMates(res.locals.user.id));
    }
);

router.post(
    "/chat-mates-online-statuses",
    chatMatesOnlineStatusesValidation,
    async (req: Request, res: Response, next: Function) => Auth(req, res, next),
    chatMatesOnlineStatusesController
);

export default router;
