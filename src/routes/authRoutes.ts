import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import AuthController from "../controllers/authController";
import { validationMiddleware } from "../middlewares/validationRequestMiddleware";
import AuthDto from "../models/auth/AuthDto";

const router = Router();

const authController = container.resolve(AuthController);

router.post(
    "/login",
    validationMiddleware(AuthDto),
    (req: Request, res: Response) => {
        authController.Login(req, res);
    },
);

export default router;
