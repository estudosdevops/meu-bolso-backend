import { BankAccount, Prisma } from "@prisma/client";
import BankAccountDto from "../../../models/bankAccount/BankAccountDto";

export default interface IBankAccountRepository {
    GetAll(userId: string): Promise<BankAccount[]>;

    GetPerId(id: string): Promise<BankAccount | null>;

    Create(data: BankAccountDto): Promise<BankAccount>;

    Update(
        bankAccountId: string,
        userId: string,
        data: BankAccountDto,
    ): Promise<BankAccount>;

    UpdateBalance(
        bankAccountId: string,
        balance: number,
        tx?: Prisma.TransactionClient,
    ): Promise<BankAccount>;

    Delete(bankAccountId: string): Promise<void>;
}
