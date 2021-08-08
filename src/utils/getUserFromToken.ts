import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/consts";
import { getConnection } from "typeorm";

export const getUserFromToken = async (token: string, relations: string[] = []): Promise<User | undefined> => {
    try {
        const tokenInfo: any = jwt.verify(token, TOKEN_SECRET);

        const userRepo = getConnection().getRepository(User);
        const user = await userRepo.findOne(tokenInfo.data.id, {
            relations: relations
        });

        return user;
    } catch (error) {
        return undefined;
    }
};
