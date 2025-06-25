import { Request, Response, Router } from "express";

import { container } from "tsyringe";
import UserController from "../controllers/UserController";

const router = Router();

const userController = container.resolve(UserController);

router.get("/:id", (req: Request, res: Response) =>
    userController.GetUserPerId(req, res),
);

router.get("/:email", (req: Request, res: Response) =>
    userController.GetUserPerEmail(req, res),
);

router.post("", (req: Request, res: Response) =>
    userController.CreateNewUser(req, res),
);

router.put("/:id", (req: Request, res: Response) =>
    userController.UpdateUser(req, res),
);

router.delete("/:id", (req: Request, res: Response) =>
    userController.DeleteUser(req, res),
);

export default router;
