import { Expense } from "@prisma/client";
import ExpensesDto from "../../../models/expenses/ExpensesDto";

export default interface IExpensesRepository {
    GetAll(userId: string): Promise<Expense[]>;

    GetPerId(userId: string, expenseId: string): Promise<Expense | null>;

    Create(data: ExpensesDto, userId: string): Promise<Expense>;

    Update(
        data: ExpensesDto,
        userId: string,
        expenseId: string,
    ): Promise<Expense>;

    Delete(expenseId: string): Promise<void>;
}
