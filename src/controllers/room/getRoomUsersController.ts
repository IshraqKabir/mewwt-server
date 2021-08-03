import { Request, Response } from "express";
import { param } from "express-validator";

export const getRoomUsersValidator = [
    param("roomId").exists().toInt()
];

export const getRoomUsersController = (req: Request, res: Response) => {
    const { room } = res.locals;

    res.json(room.users);
};
