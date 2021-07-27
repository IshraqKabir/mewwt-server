import { Request, Response } from "express";
import { User } from "../models/User";

export type ApolloContext = {
    req: Request;
    res: Response;
    user: User;
}