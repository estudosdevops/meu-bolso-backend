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

    async GetPerId(id: string): Promise<BankAccount | null> {
        return await this._prisma.bankAccount.findUnique({
            where: { id, active: true },
            include: { bank: true },
        });
    }

    async Create(data: BankAccountDto): Promise<BankAccount> {
        return await this._prisma.bankAccount.create({
            data,
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
                updatedAt: new Date(Date.now()),
            },
        });
    }

    async UpdateBalance(
        bankAccountId: string,
        balance: number,
    ): Promise<BankAccount> {
        return await this._prisma.bankAccount.update({
            where: {
                id: bankAccountId,
                active: true,
            },
            data: {
                balance,
                updatedAt: new Date(Date.now()),
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
                updatedAt: new Date(Date.now()),
            },
        });
    }
}
