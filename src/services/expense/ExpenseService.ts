import { Expense } from "@prisma/client";
import IExpenseService from "./interfaces/IExpenseService";

export default class ExpenseService implements IExpenseService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    GetPerId(id: string): Promise<Expense> {
        throw new Error("Method not implemented.");
    }
}
