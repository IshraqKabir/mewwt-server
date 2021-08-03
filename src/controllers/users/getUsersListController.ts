import { Request, Response } from "express";
import { query } from "express-validator";
import { getConnection } from "typeorm";
import { User } from "../../models/User";

export const getUsersListValidation = [
    query("q").isString(),
];

export const getUsersListController = async (req: Request, res: Response) => {
    const searchTerm = req.query.q;

    if (!searchTerm) {
        return res.json([]);
    }

    const user = res.locals.user as User;

    const users = await getConnection()
        .createQueryBuilder(User, "user")
        .where("user.id != :userId", { userId: user.id })
        .where("user.first_name ILIKE :searchTerm", { searchTerm: `%${searchTerm}%` })
        .orWhere("user.last_name ILIKE :searchTerm", { searchTerm: `%${searchTerm}%` })
        .offset(1)
        .limit(1)
        .getMany();

    return res.json(users);
};
