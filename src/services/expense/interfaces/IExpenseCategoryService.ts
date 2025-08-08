import { ExpenseCategory } from "@prisma/client";

export default interface IExpenseCategoryService {
    GetPerId(id: string, userId: string): Promise<ExpenseCategory>;

    GetAll(userId: string): Promise<ExpenseCategory[]>;

    Create(name: string, userId: string): Promise<ExpenseCategory>;

    Update(
        name: string,
        categoryId: string,
        userId: string,
    ): Promise<ExpenseCategory>;

    Delete(categoryId: string): Promise<void>;
}
