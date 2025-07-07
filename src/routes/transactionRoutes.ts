import { Request, Response, Router } from "express";
import { container } from "tsyringe";

import TransactionController from "../controllers/TransactionController";

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transactionController = container.resolve(TransactionController);

router.post("/", (req: Request, res: Response) =>
    transactionController.CreateNewTransaction(req, res),
);

export default router;
