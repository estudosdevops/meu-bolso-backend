import { Expense } from "@prisma/client";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";

import prisma from "../../configs/db/prisma";
import logger from "../../configs/logger/logger";
import ExpensesDto from "../../models/expenses/ExpensesDto";
import IExpensesRepository from "./interfaces/IExpensesRepository";
import BaseException from "../../models/bases/BaseException";

export default class ExpensesRepository implements IExpensesRepository {
    private readonly METHOD_NAME = "ExpensesRepository";

    private readonly _prisma = prisma;
    private readonly _logger = logger;

    async GetAll(userId: string): Promise<Expense[]> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting all user expenses | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
            },
        );

        const expenses = await this._prisma.expense.findMany({
            where: { userId },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] All user expenses getted with success | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
            },
        );

        return expenses;
    }

    async GetPerId(userId: string, expenseId: string): Promise<Expense> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting expense | ExpenseId: ${expenseId}, UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                expenseId,
            },
        );

        const expense = await this._prisma.expense.findUnique({
            where: {
                id: expenseId,
                userId,
            },
        });

        if (expense == null) {
            this._logger.info(
                `[${this.METHOD_NAME}] Expense not found | ExpenseId: ${expenseId}, UserId: ${userId}`,
                {
                    method_name: this.METHOD_NAME,
                    userId,
                    expenseId,
                },
            );

            throw new BaseException(
                "Expense not found",
                HttpStatusCode.NOT_FOUND,
            );
        }

        this._logger.info(
            `[${this.METHOD_NAME}] All user expenses getted with success | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
            },
        );

        return expense;
    }

    async Create(data: ExpensesDto, userId: string): Promise<Expense> {
        this._logger.info(
            `[${this.METHOD_NAME}] Creating a new expense | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
            },
        );

        const expense = await this._prisma.expense.create({
            data: {
                ...data,
                userId,
            },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Expense created with successfully | ExpenseId: ${expense.id}, UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                expenseId: expense.id,
            },
        );

        return expense;
    }

    async Update(
        data: ExpensesDto,
        userId: string,
        expenseId: string,
    ): Promise<Expense> {
        this._logger.info(
            `[${this.METHOD_NAME}] Updating a expense | UserId: ${userId} | ExpenseId: ${expenseId}, UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                expenseId,
            },
        );

        const expense = await this._prisma.expense.update({
            where: {
                id: expenseId,
                userId,
            },
            data: {
                ...data,
                updatedAt: Date.now().toString(),
            },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Expense updated with successfully | ExpenseId: ${expenseId}, UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                expenseId: expense.id,
            },
        );

        return expense;
    }

    async Delete(expenseId: string): Promise<void> {
        this._logger.info(
            `[${this.METHOD_NAME}] Deleting a expense | ExpenseId: ${expenseId}`,
            {
                method_name: this.METHOD_NAME,
                expenseId,
            },
        );

        await this._prisma.expense.delete({
            where: { id: expenseId },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Expense deleted with successfully`,
            {
                method_name: this.METHOD_NAME,
            },
        );
    }
}
