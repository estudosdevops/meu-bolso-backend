import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import { ExpenseCategory } from "@prisma/client";

import IExpenseCategoryService from "./interfaces/IExpenseCategoryService";
import IExpenseCategoryRepository from "../../repositories/expenseCategory/interfaces/IExpenseCategoryRepository";

import logger from "../../configs/logger/logger";

import BaseException from "../../models/bases/BaseException";

@injectable()
export default class ExpenseCategoryService implements IExpenseCategoryService {
    constructor(
        @inject("IExpensesCategoryRepository")
        private readonly _expenseCategoryRepository: IExpenseCategoryRepository,
    ) {}

    private readonly _logger = logger;

    private readonly SERVICE_NAME = "ExpenseCategoryService";

    async GetPerId(id: string, userId: string): Promise<ExpenseCategory> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] Getting a expense category by ID | UserId: ${userId} | ExpenseCategoryId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerId.name,
                userId,
                expenseCategoryId: id,
            },
        );

        const category = await this._expenseCategoryRepository.GetPerId(
            userId,
            id,
        );

        if (category == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.GetPerId.name}] Expense category not founded | UserId: ${userId} | ExpenseCategoryId: ${id}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.GetPerId.name,
                    userId,
                    expenseCategoryId: id,
                },
            );

            throw new BaseException(
                "Expense category not exists",
                HttpStatusCode.BAD_REQUEST,
            );
        }

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] Expense category retrieved with success | UserId: ${userId} | ExpenseCategoryId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerId.name,
                userId,
                expenseCategoryId: id,
            },
        );

        return category;
    }

    async GetAll(userId: string): Promise<ExpenseCategory[]> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Getting all user expense categories | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        const categories = await this._expenseCategoryRepository.GetAll(userId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Retrieved ${categories.length} expense categories from user | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        return categories;
    }

    async Create(name: string, userId: string): Promise<ExpenseCategory> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] Creating a new expense category | UserId: ${userId} | ExpenseCategoryName: ${name}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                expenseCategoryName: name,
                userId,
            },
        );

        const category = await this._expenseCategoryRepository.Create(
            userId,
            name,
        );

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] Created expense category with success | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userId,
            },
        );

        return category;
    }

    async Update(
        name: string,
        categoryId: string,
        userId: string,
    ): Promise<ExpenseCategory> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Updating expense category | ExpenseCategoryId: ${categoryId} | NewName: ${name}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                expenseCategoryId: categoryId,
                newName: name,
            },
        );

        const category = await this._expenseCategoryRepository.GetPerId(
            userId,
            categoryId,
        );

        if (category == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.Update.name}] Expense category not found for update | ExpenseCategoryId: ${categoryId}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.Update.name,
                    expenseCategoryId: categoryId,
                },
            );

            throw new BaseException(
                "Expense category not exists",
                HttpStatusCode.BAD_REQUEST,
            );
        }

        const updatedCategory = await this._expenseCategoryRepository.Update(
            categoryId,
            userId,
            name,
        );

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Updated expense category with success | ExpenseCategoryId: ${categoryId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                expenseCategoryId: categoryId,
            },
        );

        return updatedCategory;
    }

    async Delete(categoryId: string): Promise<void> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] Deleting expense category | ExpenseCategoryId: ${categoryId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
                expenseCategoryId: categoryId,
            },
        );

        await this._expenseCategoryRepository.Delete(categoryId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] Deleted expense category with success | ExpenseCategoryId: ${categoryId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
                expenseCategoryId: categoryId,
            },
        );
    }
}
