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

const router = express.Router();

router.post('/login',
    [
        check('email').isEmail(),
        check('password').isLength({ min: 3 }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const userRepo = getConnection().getRepository(User);
        const user = await userRepo.findOne({
            where:
            {
                email: req.body.email
            },
            select: [ "id", "email", "firstName", "lastName", "password", "authToken", ],
        });

        if (!user) {
            return {
                errors: [
                    {
                        param: "email",
                        msg: "Email not found"
                    }
                ],
            };
        }

        const { password } = req.body;

        let passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            return {
                errors: [
                    {
                        param: "password",
                        message: "Wrong password",
                    }
                ]
            };
        }

        return res.status(200).json({
            data: {
                user: user,
            }
        });
    });

router.post('/register',
    [
        check('email').isEmail().custom(emailShouldNotExist),
        check('firstName').isLength({ min: 3 }),
        check('lastName').isLength({ min: 3 }),
        check('password').isLength({ min: 3 }),
        check('confirmPassword').isLength({ min: 3 }).custom(isSameToPassword),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const {
            email,
            firstName,
            lastName,
            password
        } = req.body;

        const connection = getConnection();

        const userRepo = connection.getRepository(User);
        const user = new User();

        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = await bcrypt.hash(password, BCRYPT_HASH_ROUNDS);

        await userRepo.save(user);

        const authToken = jwt.sign({
            data: {
                id: user.id
            }
        }, TOKEN_SECRET, { expiresIn: "100y" });

        user.authToken = authToken;

        await userRepo.save(user);

        res.status(200).json({
            data: { user },
        });
    }
);

router.get('/me',
    Auth
    , (req, res) => {
        res.json(req.user);
    });

export default router;
