import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { RegisterUserInput, UserRegisterResponse } from "../utils/validation/UserResolver/RegisterUserValidation";
import { User } from "../model/User";

import bcrypt from "bcrypt";
import { FieldError } from "../utils/validation/FieldError";
import { AuthToken } from "../model/AuthToken";
import jwt from "jsonwebtoken";

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async users() {
        const userRepo = getConnection().getRepository(User);
        return await userRepo.find();
    }

    @Mutation(() => UserRegisterResponse)
    async registerUser(
        @Arg("data") data: RegisterUserInput
    ): Promise<UserRegisterResponse> {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = data;

        const errors: FieldError[] = [];

        if (password !== confirmPassword) {
            errors.push(
                {
                    field: `password`,
                    message: `confirm password doesn't match`
                }
            )
        }

        const connection = getConnection();

        const userRepo = connection.getRepository(User);

        const checkUserForEmail = await userRepo.findOne({ email: email });

        if (checkUserForEmail) {
            errors.push(
                {
                    field: `email`,
                    message: `a user with this email already exists.`
                }
            )
        }

        if (errors.length > 0) {
            return {
                data: null,
                errors: errors,
            }
        }

        const user = new User();

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);

        await userRepo.save(user);

        // store token for user
        const userAuthToken = jwt.sign({
            data: user,
        }, process.env.TOKEN_SECRET as string, { expiresIn: "100y" });

        const authTokenRepo = connection.getRepository(AuthToken);

        const authToken = new AuthToken();
        authToken.token = userAuthToken;
        authToken.user = user;

        await authTokenRepo.save(authToken);

        user.authToken = authToken;

        return {
            data: user,
            errors: null,
        };
    }
}
