import { Bank } from "@prisma/client";
import BankDto from "../../../models/bank/bankDto";

export default interface IBankService {
    GetAll(userId: string): Promise<Bank[]>;
    Create(data: BankDto): Promise<Bank>;
    Update(data: BankDto, id: string): Promise<Bank>;
    Delete(id: string): Promise<void>;
}
