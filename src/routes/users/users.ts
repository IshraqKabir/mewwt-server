import express, { Request, Response } from "express";
import { getUsersListController, getUsersListValidation } from "../../controllers/users/getUsersListController";
import { Auth } from "../../middlewares/auth";

const router = express.Router();

router.get('/list',
    getUsersListValidation,
    (req: Request, res: Response, next: Function) => Auth(req, res, next),
    getUsersListController
);

export default router;
