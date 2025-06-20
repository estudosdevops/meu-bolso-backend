import { BankAccount } from "@prisma/client";
import BankAccountDto from "../../../models/bankAccount/BankAccountDto";

export default interface IBankAccountRepository {
    GetAll(userId: string): Promise<BankAccount[]>;

    GetPerId(userId: string, id: string): Promise<BankAccount>;

    Create(userId: string, data: BankAccountDto): Promise<BankAccount>;

    Update(
        bankAccountId: string,
        userId: string,
        data: BankAccountDto,
    ): Promise<BankAccount>;

    Delete(bankAccountId: string): Promise<void>;
}
