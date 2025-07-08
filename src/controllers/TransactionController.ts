import { inject, injectable } from "tsyringe";
import ITransactionService from "../services/transaction/interfaces/ITransactionService";
import { Request, Response } from "express";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";

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
}
