import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { RegisterUserInput, UserRegisterResponse } from "../utils/validation/UserResolver/RegisterUserValidation";
import { User } from "../model/User";

import bcrypt from "bcrypt";
import { FieldError } from "../utils/validation/FieldError";
import { AuthToken } from "../model/AuthToken";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/consts";
import { ExpressContext } from "apollo-server-express";
import { ApolloContext } from "../types/ApolloContext";
import { UserLoginInput, UserLoginResponse } from "../utils/validation/UserResolver/LoginUserValidation";

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async users() {
        const userRepo = getConnection().getRepository(User);
        return await userRepo.find();
    }

    @Authorized()
    @Query(() => User)
    async me(
        @Ctx() { user }: ApolloContext
    ): Promise<User> {
        return user;
    }

    @Mutation(() => UserRegisterResponse)
    async registerUser(
        @Arg("data") data: RegisterUserInput,
        @Ctx() { res }: ExpressContext
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
            data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        }, TOKEN_SECRET, { expiresIn: "100y" });

        const authTokenRepo = connection.getRepository(AuthToken);

        const authToken = new AuthToken();
        authToken.token = userAuthToken;
        authToken.user = user;

        await authTokenRepo.save(authToken);

        user.authToken = authToken;
        userRepo.save(user);

        return {
            data: user,
            errors: null,
        };
    }

    @Mutation(() => UserLoginResponse)
    async login(
        @Arg("data") data: UserLoginInput,
    ) {
        const { email, password } = data;

        const userRepo = getConnection().getRepository(User);

        const user = await userRepo.findOne({
            where: {
                email: email
            },
            relations: ["authToken"]
        });

        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "no account with this email exists",
                    }
                ]
            }
        }

        let passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "wrong password",
                    }
                ]
            }
        }

        return {
            data: user
        }
    }
}


