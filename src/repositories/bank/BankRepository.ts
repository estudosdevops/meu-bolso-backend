import { Bank } from "@prisma/client";
import IBankRepository from "./interfaces/IBankRepository";
import BankDto from "../../models/bank/bankDto";
import prisma from "../../configs/db/prisma";

export default class BankRepository implements IBankRepository {
    private readonly _prisma = prisma;

    async GetPerId(id: string): Promise<Bank | null> {
        return await this._prisma.bank.findUnique({
            where: { id },
        });
    }

    async Update(data: BankDto, id: string): Promise<Bank> {
        return await this._prisma.bank.update({
            where: { id },
            data,
        });
    }

    async Delete(id: string): Promise<void> {
        await this._prisma.bank.delete({
            where: { id },
        });
    }

    async Create(data: BankDto): Promise<Bank> {
        return await this._prisma.bank.create({
            data,
        });
    }
}
