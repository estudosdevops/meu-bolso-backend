import { ExpenseCategory } from "@prisma/client";
import IExpenseCategoryRepository from "./interfaces/IExpenseCategoryRepository";
import prisma from "../../configs/db/prisma";

export default class ExpenseCategoryRepository
    implements IExpenseCategoryRepository
{
    private readonly _prisma = prisma;

    async GetAll(userId: string): Promise<ExpenseCategory[]> {
        return await this._prisma.expenseCategory.findMany({
            where: { userId },
        });
    }
    async GetPerId(
        userId: string,
        id: string,
    ): Promise<ExpenseCategory | null> {
        return await this._prisma.expenseCategory.findUnique({
            where: {
                id,
                userId,
            },
        });
    }

    async Create(userId: string, name: string): Promise<ExpenseCategory> {
        return await this._prisma.expenseCategory.create({
            data: {
                userId,
                name,
            },
        });
    }

    async Update(
        expenseCategoryId: string,
        userId: string,
        name: string,
    ): Promise<ExpenseCategory> {
        return await this._prisma.expenseCategory.update({
            where: {
                id: expenseCategoryId,
                userId,
            },
            data: {
                name,
                updatedAt: Date.now().toString(),
            },
        });
    }
    async Delete(id: string): Promise<void> {
        await this._prisma.expenseCategory.delete({
            where: { id },
        });
    }
}
