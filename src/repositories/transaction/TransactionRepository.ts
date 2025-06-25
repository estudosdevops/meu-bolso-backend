import { Transaction } from "@prisma/client";
import TransactionDto from "../../models/transaction/TransactioDto";
import ITransactionRepository from "./interfaces/ITransactionRepository";
import prisma from "../../configs/db/prisma";
import logger from "../../configs/logger/logger";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";

export class TransactionRepository implements ITransactionRepository {
    private readonly METHOD_NAME = "TransactionRepository";

    private readonly _prisma = prisma;
    private readonly _logger = logger;

    async GetAll(userId: string): Promise<Transaction[]> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting all transactions | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
            },
        );

        const transactions = await this._prisma.transaction.findMany({
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

        this._logger.info(
            `[${this.METHOD_NAME}] Retrieved ${transactions.length} transactions for UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                transactionCount: transactions.length,
            },
        );

        return transactions;
    }

    async GetPerId(
        userId: string,
        transactionId: string,
    ): Promise<Transaction> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting transaction by ID | UserId: ${userId}, TransactionId: ${transactionId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                transactionId,
            },
        );

        const transaction = await this._prisma.transaction.findUnique({
            where: {
                id: transactionId,
                userId,
            },
        });

        if (transaction == null) {
            this._logger.warn(
                `[${this.METHOD_NAME}] Transaction not found | UserId: ${userId}, TransactionId: ${transactionId}`,
                {
                    method_name: this.METHOD_NAME,
                    userId,
                    transactionId,
                },
            );

            throw new BaseException(
                "Transaction not found",
                HttpStatusCode.NOT_FOUND,
            );
        }

        this._logger.info(
            `[${this.METHOD_NAME}] Retrieved transaction | UserId: ${userId}, TransactionId: ${transactionId}`,
            {
                method_name: this.METHOD_NAME,
                userId,
                transactionId,
            },
        );

        return transaction;
    }

    async Create(data: TransactionDto): Promise<Transaction> {
        this._logger.info(
            `[${this.METHOD_NAME}] Creating transaction in bank account | BankAccountId: ${data.bankAccountId}, UserId: ${data.userId}`,
            {
                method_name: this.METHOD_NAME,
                bankAccountId: data.bankAccountId,
                userId: data.userId,
            },
        );

        const transaction = await this._prisma.transaction.create({
            data,
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Transaction created successfully | TransactionId: ${transaction.id}`,
            {
                method_name: this.METHOD_NAME,
                transactionId: transaction.id,
            },
        );

        return transaction;
    }

    async Update(
        transactionId: string,
        userId: string,
        data: TransactionDto,
    ): Promise<Transaction> {
        this._logger.info(
            `[${this.METHOD_NAME}] Updating transaction | TransactionId: ${transactionId}, UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                transactionId,
                userId,
            },
        );

        const updatedTransaction = await this._prisma.transaction.update({
            where: { id: transactionId },
            data,
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Transaction updated successfully | TransactionId: ${updatedTransaction.id}`,
            {
                method_name: this.METHOD_NAME,
                transactionId: updatedTransaction.id,
            },
        );

        return updatedTransaction;
    }

    async Delete(transactionId: string): Promise<void> {
        this._logger.info(
            `[${this.METHOD_NAME}] Deleting transaction | TransactionId: ${transactionId}`,
            {
                method_name: this.METHOD_NAME,
                transactionId,
            },
        );

        await this._prisma.transaction.delete({
            where: { id: transactionId },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Transaction deleted successfully`,
            {
                method_name: this.METHOD_NAME,
                transactionId,
            },
        );
    }
}
