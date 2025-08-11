import { Expense, Prisma } from "@prisma/client";
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

    UpdatePaidProperty(
        expenseId: string,
        paid: boolean,
        tx?: Prisma.TransactionClient,
    ): Promise<void>;

    Delete(expenseId: string): Promise<void>;
}
