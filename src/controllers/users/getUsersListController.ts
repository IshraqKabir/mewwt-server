import { Request, Response } from "express";
import { query } from "express-validator";
import { getConnection } from "typeorm";
import { User } from "../../models/User";

export const getUsersListValidation = [
    query("q").isString().trim(),
];

export const getUsersListController = async (req: Request, res: Response) => {
    const searchTerm = req.query.q;

    if (!searchTerm) {
        return res.json([]);
    }

    const user = res.locals.user as User;

    const users = await getConnection()
        .createQueryBuilder(User, "user")
        .where("(user.id != :userId) AND (user.first_name ILIKE :searchTerm OR user.last_name ILIKE :searchTerm)", { searchTerm: `%${searchTerm}%`, userId: user.id })
        .getMany();

    return res.json(users);
};
