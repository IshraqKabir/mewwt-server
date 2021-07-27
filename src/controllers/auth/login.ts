import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { User } from "../../models/User";
import bcrypt from "bcrypt";

export const loginValidation = [
    check('email').isEmail(),
    check('password').isLength({ min: 3 }),
];

export const loginController = async (req: Request, res: Response) => {
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
};
