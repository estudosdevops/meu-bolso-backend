import { HttpStatusCode } from "../models/enums/HttpStatusCode";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import IBankAccountService from "../services/bankAccount/interfaces/IBankAccountService";

@injectable()
export default class BankAccountController {
    constructor(
        @inject("IBankAccountService")
        private readonly _bankAccountService: IBankAccountService,
    ) {}

    async GetAllBankAccounts(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const response = await this._bankAccountService.GetAll(userId);

        res.status(HttpStatusCode.OK).json(response);
    }

    async GetBankAccountPerId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const response = await this._bankAccountService.GetPerId(id);

        res.status(HttpStatusCode.OK).json(response);
    }

    async CreateBankAccount(req: Request, res: Response): Promise<void> {
        const bankAccountBody = req.body;

        const response = await this._bankAccountService.Create(bankAccountBody);

        res.status(HttpStatusCode.OK).json(response);
    }

    async UpdateBankAccount(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const bankAccountBody = req.body;

        const response = await this._bankAccountService.Update(
            id,
            bankAccountBody,
        );

        res.status(HttpStatusCode.OK).json(response);
    }

    async UpdateBalanceBankAccount(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const balance = parseFloat(req.query.balance as string);

        const response = await this._bankAccountService.UpdateBalance(
            id,
            balance,
        );

        res.status(HttpStatusCode.OK).json(response);
    }

    async DeleteBankAccount(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await this._bankAccountService.Delete(id);

        res.status(HttpStatusCode.NO_CONTENT).json();
    }
}
