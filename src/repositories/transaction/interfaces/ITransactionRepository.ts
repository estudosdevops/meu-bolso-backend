import { Transaction } from "@prisma/client";
import TransactionDto from "../../../models/transaction/TransactioDto";

export default interface ITransactionRepository {
    GetAll(userId: string): Promise<Transaction[]>;

    GetPerId(
        userId: string,
        transactionId: string,
    ): Promise<Transaction | null>;

    Create(data: TransactionDto): Promise<Transaction>;

    Update(
        transactionId: string,
        userId: string,
        data: TransactionDto,
    ): Promise<Transaction>;

    Delete(transactionId: string): Promise<void>;
}
