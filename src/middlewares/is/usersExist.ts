import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { User } from "../../models/User";

export const usersExist = async (req: Request, res: Response, next: Function) => {
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) {
        return Promise.reject("userIds has to be an array of userIds");
    }

    const connection = getConnection();

    const users = await connection.createQueryBuilder(User, "user")
        .where("user.id in (:...userIds)", { userIds: userIds })
        .getMany();

    res.locals.users = users;

    if (users.length != userIds.length) {
        return res.status(422).json("one or more users not found");
    }

    next();
};