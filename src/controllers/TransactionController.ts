import { inject, injectable } from "tsyringe";
import ITransactionService from "../services/transaction/interfaces/ITransactionService";

@injectable()
export default class TransactionController {
    constructor(
        @inject("ITransactionService")
        private readonly _transactionService: ITransactionService,
    ) {}
}
