import { Prisma, Transaction } from "@prisma/client";
import TransactionDto from "../../../models/transaction/TransactioDto";
import UpdateTransactionDto from "../../../models/transaction/UpdateTransactionDto";

export default interface ITransactionRepository {
    GetAll(userId: string): Promise<Transaction[]>;

    GetPerId(
        userId: string,
        transactionId: string,
    ): Promise<Transaction | null>;

    Create(
        data: TransactionDto,
        tx?: Prisma.TransactionClient,
    ): Promise<Transaction>;

    Update(
        transactionId: string,
        userId: string,
        data: UpdateTransactionDto,
        tx?: Prisma.TransactionClient,
    ): Promise<Transaction>;

    Delete(transactionId: string, tx?: Prisma.TransactionClient): Promise<void>;
}
