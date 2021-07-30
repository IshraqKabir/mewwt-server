import { Request, Response } from "express";

export const getRoomUsersController = (req: Request, res: Response) => {
    const { room } = res.locals;

    res.json(room.users);
};
