import { container } from "tsyringe";
import { validationMiddleware } from "../middlewares/validationRequestMiddleware";
import { Request, Response, Router } from "express";

import BankAccountController from "../controllers/BankAccountController";
import BankAccountDto from "../models/bankAccount/BankAccountDto";

const router = Router();

const bankAccountController = container.resolve(BankAccountController);

router.get("/all/:userId", (req: Request, res: Response) =>
    bankAccountController.GetAllBankAccounts(req, res),
);

router.get("/:id", (req: Request, res: Response) =>
    bankAccountController.GetBankAccountPerId(req, res),
);

router.post(
    "/",
    validationMiddleware(BankAccountDto),
    (req: Request, res: Response) =>
        bankAccountController.CreateBankAccount(req, res),
);

router.put(
    "/:id",
    validationMiddleware(BankAccountDto),
    (req: Request, res: Response) =>
        bankAccountController.UpdateBankAccount(req, res),
);

router.patch("/:id", (req: Request, res: Response) =>
    bankAccountController.UpdateBalanceBankAccount(req, res),
);

router.delete("/:id", (req: Request, res: Response) =>
    bankAccountController.DeleteBankAccount(req, res),
);

export default router;
