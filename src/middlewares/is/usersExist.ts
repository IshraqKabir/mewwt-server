import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { User } from "../../models/User";

export const usersExist = async (
    req: Request,
    res: Response,
    next: Function
) => {
    const { userIds } = req.body;

    if (
        !Array.isArray(userIds) ||
        userIds.length < 1 ||
        !Number.isInteger(userIds[0])
    ) {
        res.status(422).json("userIds has to be an array of userIds");
        res.end();
        return;
    }

    const connection = getConnection();

    const users = await connection
        .createQueryBuilder(User, "user")
        .where("user.id in (:...userIds)", { userIds: userIds })
        .getMany();

    res.locals.users = users;

    if (users.length != userIds.length) {
        res.status(422).json("one or more users not found");
        res.end();
        return;
    }

    next();
};
