import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { User } from "../../models/User";
import bcrypt from "bcrypt";

export const loginValidation = [
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 3 }).trim().escape(),
];

export const loginController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const email = req.body.email;

    const user = await getConnection().manager.findOne(User, {
        where: {
            email: email,
        },
        select: [
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "authToken",
        ],
    });

    if (!user) {
        return res.status(200).json({
            errors: [
                {
                    param: "email",
                    msg: "Email not found",
                },
            ],
        });
    }

    const { password } = req.body;

    let passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
        return res.status(200).json({
            errors: [
                {
                    param: "password",
                    msg: "Wrong password",
                },
            ],
        });
    }

    return res.status(200).json({
        data: {
            ...user,
            password: "",
        },
    });
};
