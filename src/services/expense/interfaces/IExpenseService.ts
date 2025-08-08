import { Expense } from "@prisma/client";
import ExpensesDto from "../../../models/expenses/ExpensesDto";

export default interface IExpenseService {
    GetPerId(userId: string, id: string): Promise<Expense>;

    GetAll(userId: string): Promise<Expense[]>;

    Create(userId: string, data: ExpensesDto): Promise<Expense>;

    Update(
        userId: string,
        expenseId: string,
        data: ExpensesDto,
    ): Promise<Expense>;

    Delete(expenseId: string): Promise<void>;
}
