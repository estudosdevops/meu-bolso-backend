import { Expense } from "@prisma/client";

export default interface IExpenseService {
    GetPerId(id: string): Promise<Expense>;
}
