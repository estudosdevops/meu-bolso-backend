import { container } from "tsyringe";
import { validationMiddleware } from "../middlewares/validationRequestMiddleware";
import { Request, Response, Router } from "express";

import BankController from "../controllers/BankController";
import BankDto from "../models/bank/bankDto";

const router = Router();

const bankController = container.resolve(BankController);

router.get("/all/:userId", (req: Request, res: Response) =>
    bankController.GetAllBank(req, res),
);

router.post("", validationMiddleware(BankDto), (req: Request, res: Response) =>
    bankController.CreateBank(req, res),
);

router.put(
    "/:id",
    validationMiddleware(BankDto),
    (req: Request, res: Response) => bankController.UpdateBank(req, res),
);

router.delete("/:id", (req: Request, res: Response) =>
    bankController.DeleteBank(req, res),
);

export default router;
