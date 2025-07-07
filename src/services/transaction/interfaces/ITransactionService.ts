import { Transaction } from "@prisma/client";

export default interface ITransactionService {
    GetAll(userId: string): Promise<Transaction[]>;
}
