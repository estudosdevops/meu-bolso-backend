import { Prisma, Transaction } from "@prisma/client";
import TransactionDto from "../../models/transaction/TransactioDto";
import ITransactionRepository from "./interfaces/ITransactionRepository";
import prisma from "../../configs/db/prisma";

export default class TransactionRepository implements ITransactionRepository {
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

    async Create(
        data: TransactionDto,
        tx?: Prisma.TransactionClient,
    ): Promise<Transaction> {
        const client = tx ?? this._prisma;

        return await client.transaction.create({
            data,
        });
    }

    async Update(
        transactionId: string,
        userId: string,
        data: TransactionDto,
        tx?: Prisma.TransactionClient,
    ): Promise<Transaction> {
        const client = tx ?? this._prisma;

        return await client.transaction.update({
            where: { id: transactionId, userId },
            data,
        });
    }

    async Delete(
        transactionId: string,
        tx?: Prisma.TransactionClient,
    ): Promise<void> {
        const client = tx ?? this._prisma;

        await client.transaction.delete({
            where: { id: transactionId },
        });
    }
}
