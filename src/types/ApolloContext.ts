import { Request, Response } from "express";
import { User } from "../model/User";

export type ApolloContext = {
    req: Request;
    res: Response;
    user: User;
}