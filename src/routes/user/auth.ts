import express from "express";
import { Request, Response } from "express-serve-static-core";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { User } from "../../models/User";
import { emailShouldNotExist } from "../../validators/emailShouldNotExist";
import { isSameToPassword } from "../../validators/isSameToPassword";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BCRYPT_HASH_ROUNDS, TOKEN_SECRET } from "../../config/consts";
import { Auth } from "../../middlewares/auth";
import { loginController, loginValidation } from "../../controllers/auth/login";
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
    Auth
    , (req, res) => {
        res.json(req.user);
    });

export default router;
