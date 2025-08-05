import { Transaction } from "@prisma/client";
import TransactionDto from "../../../models/transaction/TransactioDto";
import UpdateTransactionDto from "../../../models/transaction/UpdateTransactionDto";

export default interface ITransactionService {
    GetAll(userId: string): Promise<Transaction[]>;

    GetPerId(id: string, userId: string): Promise<Transaction>;

    Create(data: TransactionDto): Promise<Transaction>;

    Update(
        id: string,
        userId: string,
        data: UpdateTransactionDto,
    ): Promise<Transaction>;

    Delete(id: string, userId: string): Promise<void>;
}
