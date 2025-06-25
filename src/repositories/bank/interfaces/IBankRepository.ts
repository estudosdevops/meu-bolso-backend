import { Bank } from "@prisma/client";
import BankDto from "../../../models/bank/bankDto";

export default interface IBankRepository {
    GetPerId(id: string): Promise<Bank | null>;

    Create(data: BankDto): Promise<Bank>;

    Update(data: BankDto, id: string): Promise<Bank>;

    Delete(id: string): Promise<void>;
}
