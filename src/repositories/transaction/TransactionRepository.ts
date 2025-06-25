import { Transaction } from "@prisma/client";
import TransactionDto from "../../models/transaction/TransactioDto";
import ITransactionRepository from "./interfaces/ITransactionRepository";
import prisma from "../../configs/db/prisma";

export class TransactionRepository implements ITransactionRepository {
    private readonly _prisma = prisma;

    async GetAll(userId: string): Promise<Transaction[]> {
        return await this._prisma.transaction.findMany({
            where: { userId },
            include: {
                bankAccount: {
                    select: {
                        bank: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async GetPerId(
        userId: string,
        transactionId: string,
    ): Promise<Transaction | null> {
        return await this._prisma.transaction.findUnique({
            where: {
                id: transactionId,
                userId,
            },
        });
    }

    async Create(data: TransactionDto): Promise<Transaction> {
        return await this._prisma.transaction.create({
            data,
        });
    }

    async Update(
        transactionId: string,
        userId: string,
        data: TransactionDto,
    ): Promise<Transaction> {
        return await this._prisma.transaction.update({
            where: { id: transactionId, userId },
            data,
        });
    }

    async Delete(transactionId: string): Promise<void> {
        await this._prisma.transaction.delete({
            where: { id: transactionId },
        });
    }
}
