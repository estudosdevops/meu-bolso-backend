import { inject, injectable } from "tsyringe";
import ITransactionService from "./interfaces/ITransactionService";
import ITransactionRepository from "../../repositories/transaction/interfaces/ITransactionRepository";
import { Transaction } from "@prisma/client";

@injectable()
export default class TransactionService implements ITransactionService {
    constructor(
        @inject("ITransactionRepository")
        private readonly _transactionRepository: ITransactionRepository,
    ) {}

    GetAll(userId: string): Promise<Transaction[]> {
        throw new Error(userId);
    }
}
