import { Request, Response, Router } from "express";

import { container } from "tsyringe";
import UserController from "../controllers/UserController";

const router = Router();

const userController = container.resolve(UserController);

router.get("/:id", (req: Request, res: Response) =>
    userController.GetUserPerId(req, res),
);

export default router;
