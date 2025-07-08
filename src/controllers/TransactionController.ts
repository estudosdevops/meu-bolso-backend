import { HttpStatusCode } from "../models/enums/HttpStatusCode";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import ITransactionService from "../services/transaction/interfaces/ITransactionService";

@injectable()
export default class TransactionController {
    constructor(
        @inject("ITransactionService")
        private readonly _transactionService: ITransactionService,
    ) {}

    async CreateNewTransaction(req: Request, res: Response): Promise<void> {
        const transactionData = req.body;

        const response = await this._transactionService.Create(transactionData);

        res.status(HttpStatusCode.OK).json(response);
    }

    async GetAllTransactions(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const response = await this._transactionService.GetAll(userId);

        res.status(HttpStatusCode.OK).json(response);
    }

    async GetTransactionPerId(req: Request, res: Response): Promise<void> {
        const { id, userId } = req.params;

        const response = await this._transactionService.GetPerId(id, userId);

        res.status(HttpStatusCode.OK).json(response);
    }

    async UpdateTransaction(req: Request, res: Response): Promise<void> {
        const { id, userId } = req.params;

        const transactionBody = req.body;

        const response = await this._transactionService.Update(
            id,
            userId,
            transactionBody,
        );

        res.status(HttpStatusCode.OK).json(response);
    }

    async DeleteTransaction(req: Request, res: Response): Promise<void> {
        const { id, userId } = req.params;

        await this._transactionService.Delete(id, userId);

        res.status(HttpStatusCode.NO_CONTENT).json();
    }
}
