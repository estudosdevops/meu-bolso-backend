import { ExpenseCategory } from "@prisma/client";

export default interface IExpenseCategoryRepository {
    GetAll(userId: string): Promise<ExpenseCategory[]>;

    GetPerId(userId: string, id: string): Promise<ExpenseCategory>;

    Create(userId: string, name: string): Promise<ExpenseCategory>;

    Update(
        expenseCategoryId: string,
        userId: string,
        name: string,
    ): Promise<ExpenseCategory>;

    Delete(id: string): Promise<void>;
}
