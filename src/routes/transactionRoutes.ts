import { Request, Response, Router } from "express";
import { container } from "tsyringe";

import TransactionController from "../controllers/TransactionController";
import { validationMiddleware } from "../middlewares/validationRequestMiddleware";
import TransactionDto from "../models/transaction/TransactioDto";
import UpdateTransactionDto from "../models/transaction/UpdateTransactionDto";

const router = Router();

const transactionController = container.resolve(TransactionController);

router.post(
    "/",
    validationMiddleware(TransactionDto),
    (req: Request, res: Response) =>
        transactionController.CreateNewTransaction(req, res),
);

router.get("/all/:userId", (req: Request, res: Response) =>
    transactionController.GetAllTransactions(req, res),
);

router.get("/:id/:userId", (req: Request, res: Response) =>
    transactionController.GetTransactionPerId(req, res),
);

router.put(
    "/:id/:userId",
    validationMiddleware(UpdateTransactionDto),
    (req: Request, res: Response) =>
        transactionController.UpdateTransaction(req, res),
);

router.delete("/:id/:userId", (req: Request, res: Response) =>
    transactionController.DeleteTransaction(req, res),
);

export default router;
