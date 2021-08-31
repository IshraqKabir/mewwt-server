import { Request, Response } from "express";
import { param, validationResult } from "express-validator";

export const getRoomUsersValidator = [param("roomId").exists().toInt()];

export const getRoomUsersController = (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { room } = res.locals;

    res.json(room.users);
};
