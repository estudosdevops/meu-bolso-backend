import { inject, injectable } from "tsyringe";

import IExpenseService from "../services/expense/interfaces/IExpenseService";
import IExpenseCategoryService from "../services/expense/interfaces/IExpenseCategoryService";
import { Request, Response } from "express";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";

@injectable()
export default class ExpenseController {
    constructor(
        @inject("IExpenseService")
        private readonly _expenseService: IExpenseService,

        @inject("IExpenseCategoryService")
        private readonly _expenseCategoryService: IExpenseCategoryService,
    ) {}

    // Expense Category Methods

    async GetAllExpensesCategory(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const response = await this._expenseCategoryService.GetAll(userId);

        res.status(HttpStatusCode.OK).json(response);
    }

    async GetExpenseCategoryPerId(req: Request, res: Response): Promise<void> {
        const { id, userId } = req.params;

        const response = await this._expenseCategoryService.GetPerId(
            id,
            userId,
        );

        res.status(HttpStatusCode.OK).json(response);
    }

    async CreateExpenseCategory(req: Request, res: Response): Promise<void> {
        const { name } = req.body;
        const { userId } = req.params;

        const response = await this._expenseCategoryService.Create(
            name,
            userId,
        );

        res.status(HttpStatusCode.CREATED).json(response);
    }

    async UpdateExpenseCategory(req: Request, res: Response): Promise<void> {
        const { id, userId } = req.params;
        const { name } = req.body;

        const response = await this._expenseCategoryService.Update(
            name,
            id,
            userId,
        );

        res.status(HttpStatusCode.OK).json(response);
    }

    async DeleteExpenseCategory(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await this._expenseCategoryService.Delete(id);

        res.status(HttpStatusCode.NO_CONTENT).json();
    }

    // Expenses Controller Methods

    async GetAllExpenses(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const response = await this._expenseService.GetAll(userId);

        res.status(HttpStatusCode.OK).json(response);
    }

    async GetExpensePerId(req: Request, res: Response): Promise<void> {
        const { id, userId } = req.params;

        const response = await this._expenseService.GetPerId(id, userId);

        res.status(HttpStatusCode.OK).json(response);
    }

    async CreateExpense(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const data = req.body;

        const response = await this._expenseService.Create(userId, data);

        res.status(HttpStatusCode.OK).json(response);
    }

    async UpdateExpense(req: Request, res: Response): Promise<void> {
        const { userId, id } = req.params;
        const data = req.body;

        const response = await this._expenseService.Update(userId, id, data);

        res.status(HttpStatusCode.OK).json(response);
    }

    async DeleteExpense(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await this._expenseService.Delete(id);

        res.status(HttpStatusCode.NO_CONTENT).json();
    }
}
