import { Expense } from "@prisma/client";

import prisma from "../../configs/db/prisma";
import ExpensesDto from "../../models/expenses/ExpensesDto";
import IExpensesRepository from "./interfaces/IExpensesRepository";

export default class ExpensesRepository implements IExpensesRepository {
    private readonly _prisma = prisma;

    async GetAll(userId: string): Promise<Expense[]> {
        return await this._prisma.expense.findMany({
            where: { userId },
        });
    }

    async GetPerId(userId: string, expenseId: string): Promise<Expense | null> {
        return await this._prisma.expense.findUnique({
            where: {
                id: expenseId,
                userId,
            },
        });
    }

    async Create(data: ExpensesDto, userId: string): Promise<Expense> {
        return await this._prisma.expense.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async Update(
        data: ExpensesDto,
        userId: string,
        expenseId: string,
    ): Promise<Expense> {
        return await this._prisma.expense.update({
            where: {
                id: expenseId,
                userId,
            },
            data: {
                ...data,
                updatedAt: new Date(Date.now()),
            },
        });
    }

    async Delete(expenseId: string): Promise<void> {
        await this._prisma.expense.delete({
            where: { id: expenseId },
        });
    }
}
