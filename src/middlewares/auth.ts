import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import { TOKEN_SECRET, UNAUTHENTICATED } from "../config/consts";
import { User } from "../models/User";

export const Auth = async (req: Request, res: Response, next: Function, relations?: string[]) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json(UNAUTHENTICATED);
    }

    try {
        const tokenInfo: any = jwt.verify(token, TOKEN_SECRET);

        const userRepo = getConnection().getRepository(User);
        const user = await userRepo.findOne(tokenInfo.data.id, {
            relations: relations
        });

        if (!user) {
            return res.status(401).json(UNAUTHENTICATED);
        }

        res.locals.user = user; // adding user to the response.locals object for further use
    } catch (err) {
        return res.status(401).json(UNAUTHENTICATED);
    }

    next();
};
