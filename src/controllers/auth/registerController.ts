import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { getConnection } from "typeorm";
import { BCRYPT_HASH_ROUNDS, TOKEN_SECRET } from "../../config/consts";
import { User } from "../../models/User";
import { isSameToPassword } from "../../validators/isSameToPassword";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { emailShouldNotExist } from "../../validators/emailShouldNotExist";

export const registerValidation = [
    check("email").isEmail().normalizeEmail().custom(emailShouldNotExist),
    check("firstName").isLength({ min: 3 }).trim().escape(),
    check("lastName").isLength({ min: 3 }).trim().escape(),
    check("password").isLength({ min: 3 }).trim().escape(),
    check("confirmPassword")
        .isLength({ min: 3 })
        .custom(isSameToPassword)
        .trim()
        .escape(),
];

export const registerController = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, firstName, lastName, password } = req.body;

    const connection = getConnection();

    const userRepo = connection.getRepository(User);
    const user = new User();

    user.email = email;
    user.first_name = firstName;
    user.last_name = lastName;
    user.password = await bcrypt.hash(password, BCRYPT_HASH_ROUNDS);

    await userRepo.save(user);

    const authToken = jwt.sign(
        {
            data: {
                id: user.id,
            },
        },
        TOKEN_SECRET,
        { expiresIn: "100y" }
    );

    user.authToken = authToken;

    await userRepo.save(user);

    res.status(200).json({
        data: {
            ...user,
            password: "",
        },
    });
};
