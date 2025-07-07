import { inject, injectable } from "tsyringe";
import IBankService from "../services/bank/interfaces/IBankService";
import { Request, Response } from "express";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";

@injectable()
export default class BankController {
    constructor(
        @inject("IBankService")
        private readonly _bankService: IBankService,
    ) {}

    async GetAllBank(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const response = await this._bankService.GetAll(userId);

        res.status(HttpStatusCode.OK).json(response);
    }

    async CreateBank(req: Request, res: Response): Promise<void> {
        const bankData = req.body;

        const response = await this._bankService.Create(bankData);

        res.status(HttpStatusCode.OK).json(response);
    }

    async UpdateBank(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const bankData = req.body;

        const response = await this._bankService.Update(bankData, id);

        res.status(HttpStatusCode.OK).json(response);
    }

    async DeleteBank(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await this._bankService.Delete(id);

        res.status(HttpStatusCode.NO_CONTENT).json();
    }
}
