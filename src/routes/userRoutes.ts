import { container } from "tsyringe";
import { validationMiddleware } from "../middlewares/validationRequestMiddleware";
import { Request, Response, Router } from "express";

import UserController from "../controllers/UserController";
import UserDto from "../models/user/UserDto";
import UserWithoutPassDto from "../models/user/UserWithoutPassDto";

const router = Router();

const userController = container.resolve(UserController);

router.get("/:id", (req: Request, res: Response) =>
    userController.GetUserPerId(req, res),
);

router.get("/email/:email", (req: Request, res: Response) =>
    userController.GetUserPerEmail(req, res),
);

router.post("", validationMiddleware(UserDto), (req: Request, res: Response) =>
    userController.CreateNewUser(req, res),
);

router.put(
    "/:id",
    validationMiddleware(UserWithoutPassDto),
    (req: Request, res: Response) => userController.UpdateUser(req, res),
);

router.delete("/:id", (req: Request, res: Response) =>
    userController.DeleteUser(req, res),
);

export default router;
