import { BankAccount, Prisma } from "@prisma/client";
import BankAccountDto from "../../../models/bankAccount/BankAccountDto";

export default interface IBankAccountService {
    GetAll(userId: string): Promise<BankAccount[]>;

    GetPerId(accountId: string): Promise<BankAccount>;

    Create(data: BankAccountDto): Promise<BankAccount>;

    Update(accountId: string, data: BankAccountDto): Promise<BankAccount>;

    UpdateBalance(
        accountId: string,
        balance: number,
        tx?: Prisma.TransactionClient,
    ): Promise<BankAccount>;

    Delete(accountId: string): Promise<void>;
}
