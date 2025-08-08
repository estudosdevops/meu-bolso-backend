import { Expense } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import ExpensesDto from "../../models/expenses/ExpensesDto";

import IExpenseService from "./interfaces/IExpenseService";
import IExpensesRepository from "../../repositories/expenses/interfaces/IExpensesRepository";

import logger from "../../configs/logger/logger";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";

@injectable()
export default class ExpenseService implements IExpenseService {
    constructor(
        @inject("IExpensesRepository")
        private readonly _expenseRepository: IExpensesRepository,
    ) {}

    private readonly _logger = logger;

    private readonly SERVICE_NAME = "ExpenseService";

    async GetAll(userId: string): Promise<Expense[]> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Getting all expenses | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        const expenses = await this._expenseRepository.GetAll(userId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Retrieved ${expenses.length} expenses with success | UserId: ${userId} `,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        return expenses;
    }

    async GetPerId(id: string, userId: string): Promise<Expense> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] Getting a expense by ID | ExpenseId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerId.name,
                expenseId: id,
            },
        );

        const expense = await this._expenseRepository.GetPerId(userId, id);

        if (expense == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.GetPerId.name}] Expense not founded | ExpenseId: ${id}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.GetPerId.name,
                    expenseId: id,
                },
            );

            throw new BaseException(
                "Expense not exists",
                HttpStatusCode.BAD_REQUEST,
            );
        }

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] Expense retrieved with success | ExpenseId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerId.name,
                expenseId: id,
            },
        );

        return expense;
    }

    async Create(userId: string, data: ExpensesDto): Promise<Expense> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] Creating a new expense | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userId,
            },
        );

        const expense = await this._expenseRepository.Create(data, userId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] Expense created with success | ExpenseId: ${expense.id} | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                expenseId: expense.id,
                userId,
            },
        );

        return expense;
    }

    async Update(
        userId: string,
        expenseId: string,
        data: ExpensesDto,
    ): Promise<Expense> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Updating a expense | ExpenseId: ${expenseId} | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                expenseId,
                userId,
            },
        );

        const expense = await this._expenseRepository.GetPerId(
            userId,
            expenseId,
        );

        if (expense == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.Update.name}] Expense not founded | ExpenseId: ${expenseId} | UserId: ${userId}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.Update.name,
                    expenseId,
                    userId,
                },
            );

            throw new BaseException(
                "Expense not exists",
                HttpStatusCode.BAD_REQUEST,
            );
        }

        const expenseUpdated = await this._expenseRepository.Update(
            data,
            userId,
            expenseId,
        );

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Expense updated with success | ExpenseId: ${expenseUpdated.id} | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                expenseId: expenseUpdated.id,
                userId,
            },
        );

        return expenseUpdated;
    }

    async Delete(expenseId: string): Promise<void> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] Deleting a expense | ExpenseId: ${expenseId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
                expenseId,
            },
        );

        await this._expenseRepository.Delete(expenseId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] Expense deleted with success | ExpenseId: ${expenseId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
                expenseId,
            },
        );
    }
}
