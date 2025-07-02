import { container } from "tsyringe";
import { validationMiddleware } from "../middlewares/validationRequestMiddleware";
import { Request, Response, Router } from "express";

import AuthController from "../controllers/authController";

import AuthDto from "../models/auth/AuthDto";
import RefreshDto from "../models/auth/RefreshDto";

const router = Router();

const authController = container.resolve(AuthController);

router.post(
    "/login",
    validationMiddleware(AuthDto),
    (req: Request, res: Response) => authController.Login(req, res),
);

router.post(
    "/refresh",
    validationMiddleware(RefreshDto),
    (req: Request, res: Response) => authController.Refresh(req, res),
);

export default router;
