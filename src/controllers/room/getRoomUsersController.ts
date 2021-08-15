import { Request, Response } from "express";
import { param } from "express-validator";
import { checkErrors } from "../../utils/checkErrors";

export const getRoomUsersValidator = [
    param("roomId").exists().toInt()
];

export const getRoomUsersController = (req: Request, res: Response) => {
    checkErrors(req, res);

    const { room } = res.locals;

    res.json(room.users);
};
