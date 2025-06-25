import { BankAccount } from "@prisma/client";
import prisma from "../../configs/db/prisma";
import BankAccountDto from "../../models/bankAccount/BankAccountDto";
import IBankAccountRepository from "./interfaces/IBankAccountRepository";

export default class BankAccountRepository implements IBankAccountRepository {
    private readonly _prisma = prisma;

    async GetAll(userId: string): Promise<BankAccount[]> {
        return await this._prisma.bankAccount.findMany({
            where: { userId, active: true },
            include: {
                bank: true,
            },
        });
    }

    async GetPerId(userId: string, id: string): Promise<BankAccount | null> {
        return await this._prisma.bankAccount.findUnique({
            where: { userId, id, active: true },
            include: { bank: true },
        });
    }

    async Create(userId: string, data: BankAccountDto): Promise<BankAccount> {
        return await this._prisma.bankAccount.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async Update(
        bankAccountId: string,
        userId: string,
        data: BankAccountDto,
    ): Promise<BankAccount> {
        return await this._prisma.bankAccount.update({
            where: {
                id: bankAccountId,
                userId: userId,
                active: true,
            },
            data: {
                ...data,
                updatedAt: Date.now().toString(),
            },
        });
    }

    async Delete(bankAccountId: string): Promise<void> {
        await this._prisma.bankAccount.update({
            where: {
                id: bankAccountId,
                active: true,
            },
            data: {
                active: false,
                updatedAt: Date.now().toString(),
            },
        });
    }
}
