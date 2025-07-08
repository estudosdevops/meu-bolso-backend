/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, injectable } from "tsyringe";
import { BankAccount, Transaction, TransactionType } from "@prisma/client";

import ITransactionRepository from "../../repositories/transaction/interfaces/ITransactionRepository";
import ITransactionService from "./interfaces/ITransactionService";
import IBankAccountService from "../bankAccount/interfaces/IBankAccountService";

import TransactionDto from "../../models/transaction/TransactioDto";

import logger from "../../configs/logger/logger";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import prisma from "../../configs/db/prisma";
import dateConvertion from "../../handlers/dateConvertion";

@injectable()
export default class TransactionService implements ITransactionService {
    constructor(
        @inject("ITransactionRepository")
        private readonly _transactionRepository: ITransactionRepository,

        @inject("IBankAccountService")
        private readonly _bankAccountService: IBankAccountService,
    ) {}

    private readonly _logger = logger;
    private readonly _prisma = prisma;

    private readonly SERVICE_NAME = "TransactionService";

    async GetAll(userId: string): Promise<Transaction[]> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Get all user transactions | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        const transactions = await this._transactionRepository.GetAll(userId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Retrieved ${transactions.length} user transactions with successfully | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        return transactions;
    }

    async GetPerId(id: string, userId: string): Promise<Transaction> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] Getting a transaction | UserId: ${userId} | TransactionId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerId.name,
                userId,
                transactionId: id,
            },
        );

        const transaction = await this._transactionRepository.GetPerId(
            userId,
            id,
        );

        if (transaction == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.GetPerId.name}] Transaction not found | UserId: ${userId} | TransactionId: ${id}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.GetPerId.name,
                    userId,
                    transactionId: id,
                },
            );

            throw new BaseException(
                "Transaction not found",
                HttpStatusCode.NOT_FOUND,
            );
        }

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] Retrieved user transactions with successfully | UserId: ${userId} | TransactionId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerId.name,
                userId,
                transactionId: id,
            },
        );

        return transaction;
    }

    async Create(data: TransactionDto): Promise<Transaction> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] Creating a new transaction in AccountId ${data.bankAccountId} | UserId: ${data.userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userId: data.userId,
            },
        );

        const account = await this._bankAccountService.GetPerId(
            data.bankAccountId,
        );

        const newBalance = this.CalculateNewBalance(
            account.balance,
            data.value,
            data.type,
        );

        data.date = dateConvertion(data.date.toString());

        try {
            const transaction = await this._prisma.$transaction(async (tx) => {
                const transactionData =
                    await this._transactionRepository.Create(data, tx);

                await this._bankAccountService.UpdateBalance(
                    data.bankAccountId,
                    newBalance,
                    tx,
                );

                return transactionData;
            });

            this._logger.info(
                `[${this.SERVICE_NAME}-${this.Create.name}] New transaction in AccountId ${data.bankAccountId} created with successfully | UserId: ${data.userId}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.Create.name,
                    userId: data.userId,
                    transactionType: data.type,
                },
            );

            return transaction;
        } catch (err: unknown) {
            this._logger.error(
                `[${this.SERVICE_NAME}-${this.Create.name}] Error to create a new transaction | Error: ${err} | UserId: ${data.userId}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.Create.name,
                    userId: data.userId,
                    error: err,
                },
            );

            throw new BaseException(
                "An error occurred when creating the new transaction",
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                err,
            );
        }
    }

    async Update(
        id: string,
        userId: string,
        data: TransactionDto,
    ): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }

    async Delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // Private methods

    private async VerifyIfTransactionExists(
        id: string,
        userId: string,
    ): Promise<void> {
        const transaction = await this._transactionRepository.GetPerId(
            userId,
            id,
        );

        if (transaction == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.VerifyIfTransactionExists.name}] Transaction not found | TransactionId: ${id}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.VerifyIfTransactionExists.name,
                    transactionId: id,
                },
            );

            throw new BaseException(
                "Transaction not found",
                HttpStatusCode.NOT_FOUND,
            );
        }
    }

    private CalculateNewBalance(
        accountBalance: number,
        transactionValue: number,
        transactionType: string,
    ): number {
        if (transactionType == TransactionType.Entry) {
            return accountBalance + transactionValue;
        } else {
            if (transactionValue > accountBalance) {
                throw new BaseException(
                    "The transaction value is greater than your account balance",
                    HttpStatusCode.BAD_REQUEST,
                );
            }

            return accountBalance - transactionValue;
        }
    }
}
