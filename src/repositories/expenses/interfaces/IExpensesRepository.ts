import { Expense, Prisma } from "@prisma/client";
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

    UpdatePaidProperty(
        expenseId: string,
        paid: boolean,
        tx?: Prisma.TransactionClient,
    ): Promise<void>;

    Delete(expenseId: string): Promise<void>;
}
