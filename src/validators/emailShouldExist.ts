import { CustomValidator } from "express-validator";
import { getConnection } from "typeorm";
import { User } from "../models/User";

export const emailShouldExist: CustomValidator = async (value) => {
    const userRepo = getConnection().getRepository(User);
    const user = await userRepo.findOne({
        where: {
            email: value
        }
    });

    if (!user) {
        return Promise.reject('E-mail not found');
    }

    return value;
}