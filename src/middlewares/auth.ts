import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import { TOKEN_SECRET } from "../config/consts";
import { User } from "../models/User";

export const Auth = async (req: Request, res: Response, next: Function) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json("Unauthenticated");
    }

    try {
        const tokenInfo: any = jwt.verify(token, TOKEN_SECRET);

        const userRepo = getConnection().getRepository(User);
        const user = await userRepo.findOne(tokenInfo.data.id);

        if (!user) {
            return res.status(401).json("Unauthenticated");
        }

        req.user = user;
    } catch (err) {
        return res.status(401).json("Unauthenticated");
    }

    next();
};
