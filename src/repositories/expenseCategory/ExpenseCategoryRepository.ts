import { ExpenseCategory } from "@prisma/client";
import IExpenseCategoryRepository from "./interfaces/IExpenseCategoryRepository";
import prisma from "../../configs/db/prisma";
import logger from "../../configs/logger/logger";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";

export default class ExpenseCategoryRepository
    implements IExpenseCategoryRepository
{
    private readonly METHOD_NAME = "ExpenseCategoryRepository";

    private readonly _prisma = prisma;
    private readonly _logger = logger;

    async GetAll(userId: string): Promise<ExpenseCategory[]> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting all user expense categories | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
            },
        );

        const expenseCategories = await this._prisma.expenseCategory.findMany({
            where: { userId },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] All user expense categories retrieved successfully | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
            },
        );

        return expenseCategories;
    }
    async GetPerId(userId: string, id: string): Promise<ExpenseCategory> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting expense category | ExpenseCategoryId: ${id} | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                id,
            },
        );

        const expenseCategory = await this._prisma.expenseCategory.findUnique({
            where: {
                id,
                userId,
            },
        });

        if (expenseCategory == null) {
            this._logger.info(
                `[${this.METHOD_NAME}] Expense category not found | ExpenseCategoryId: ${id} | UserId: ${userId}`,
                {
                    method_name: this.METHOD_NAME,
                    userId,
                    id,
                },
            );

            throw new BaseException(
                "Expense category not found",
                HttpStatusCode.NOT_FOUND,
            );
        }

        this._logger.info(
            `[${this.METHOD_NAME}] Expense category retrieved successfully | ExpenseCategoryId: ${id} | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                id,
            },
        );

        return expenseCategory;
    }

    async Create(userId: string, name: string): Promise<ExpenseCategory> {
        this._logger.info(
            `[${this.METHOD_NAME}] Creating expense category | UserId: ${userId} | Name: ${name}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                name,
            },
        );

        const expenseCategory = await this._prisma.expenseCategory.create({
            data: {
                userId,
                name,
            },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Expense category created successfully | ExpenseCategoryId: ${expenseCategory.id} | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                expenseCategoryId: expenseCategory.id,
            },
        );

        return expenseCategory;
    }

    async Update(
        expenseCategoryId: string,
        userId: string,
        name: string,
    ): Promise<ExpenseCategory> {
        this._logger.info(
            `[${this.METHOD_NAME}] Updating expense category | ExpenseCategoryId: ${expenseCategoryId} | UserId: ${userId} | Name: ${name}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                expenseCategoryId,
                name,
            },
        );

        const expenseCategory = await this._prisma.expenseCategory.update({
            where: {
                id: expenseCategoryId,
                userId,
            },
            data: {
                name,
                updatedAt: Date.now().toString(),
            },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Expense category updated successfully | ExpenseCategoryId: ${expenseCategory.id} | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                expenseCategoryId: expenseCategory.id,
            },
        );

        return expenseCategory;
    }
    async Delete(id: string): Promise<void> {
        this._logger.info(
            `[${this.METHOD_NAME}] Deleting expense category | ExpenseCategoryId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                id,
            },
        );

        await this._prisma.expenseCategory.delete({
            where: { id },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Expense category deleted successfully | ExpenseCategoryId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                id,
            },
        );
    }
}
