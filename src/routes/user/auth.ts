import express, { Request, Response } from "express";
import { Auth } from "../../middlewares/auth";
import { loginController, loginValidation } from "../../controllers/auth/loginController";
import { registerController, registerValidation } from "../../controllers/auth/registerController";

const router = express.Router();

router.post('/login',
    loginValidation,
    async (req: Request, res: Response) => {
        await loginController(req, res);
    });

router.post('/register',
    registerValidation,
    async (req: Request, res: Response) => {
        await registerController(req, res);
    }
);

router.get('/me',
    (req, res, next) => Auth(req, res, next),
    (req, res) => {
        res.json(res.locals.user);
    });

export default router;
