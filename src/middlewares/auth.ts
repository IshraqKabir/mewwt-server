import { Request, Response } from "express";
import { UNAUTHENTICATED } from "../config/consts";
import { getUserFromToken } from "../utils/getUserFromToken";

export const Auth = async (
    req: Request,
    res: Response,
    next: Function,
    relations?: string[]
) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json(UNAUTHENTICATED);
        res.end();
        return;
    }

    const user = await getUserFromToken(token, relations);

    if (user) {
        res.locals.user = user;
    } else {
        res.status(401).json(UNAUTHENTICATED);
        res.end();
        return;
    }

    next();
};
