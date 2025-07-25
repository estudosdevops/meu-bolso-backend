import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import { inject, injectable } from "tsyringe";
import { BankAccount, Transaction, TransactionType } from "@prisma/client";

import ITransactionRepository from "../../repositories/transaction/interfaces/ITransactionRepository";
import ITransactionService from "./interfaces/ITransactionService";
import IBankAccountService from "../bankAccount/interfaces/IBankAccountService";

import TransactionDto from "../../models/transaction/TransactioDto";
import UpdateTransactionDto from "../../models/transaction/UpdateTransactionDto";
import BaseException from "../../models/bases/BaseException";

import logger from "../../configs/logger/logger";
import prisma from "../../configs/db/prisma";

import dateConvertion from "../../handlers/dateConvertion";
import { transactionFieldsToChange } from "../../types/transactionFieldsToChange";

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

        const newBalance = this.CalculateNewBalanceWhenCreate(
            account.balance,
            data.value,
            data.type,
        );

        try {
            const transaction = await this._prisma.$transaction(async (tx) => {
                data.date = dateConvertion(data.date.toString());

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
        data: UpdateTransactionDto,
    ): Promise<Transaction> {
        const oldTransaction = await this.GetPerId(id, userId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Updating the transaction | TransactionId: ${id} | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                userId,
                transactionId: id,
            },
        );

        try {
            const transactionUpdated = await this._prisma.$transaction(
                async (tx) => {
                    const fieldsToChange = this.VerifyWhatFieldsChange(data);

                    if (fieldsToChange.date) {
                        this._logger.info(
                            `[${this.SERVICE_NAME}-${this.Update.name}] Updating date to transaction | UserId: ${userId} | TransactionId: ${oldTransaction.id}`,
                            {
                                service_name: this.SERVICE_NAME,
                                method_name: this.Update.name,
                                userId,
                                transactionId: oldTransaction.id,
                                fieldUpdated: "date",
                            },
                        );

                        data.date = dateConvertion(data.date.toString());
                    }

                    const transaction =
                        await this._transactionRepository.Update(
                            id,
                            userId,
                            data,
                            tx,
                        );

                    if (
                        fieldsToChange.bankAccountId &&
                        transaction.bankAccountId !=
                            oldTransaction.bankAccountId
                    ) {
                        this._logger.info(
                            `[${this.SERVICE_NAME}-${this.Update.name}] Updating bank account to transaction | UserId: ${userId} | TransactionId: ${transaction.id}`,
                            {
                                service_name: this.SERVICE_NAME,
                                method_name: this.Update.name,
                                userId,
                                transactionId: transaction.id,
                                fieldUpdated: "bankAccount",
                            },
                        );

                        const newAccount =
                            await this._bankAccountService.GetPerId(
                                transaction.id,
                            );

                        const oldAccount =
                            await this._bankAccountService.GetPerId(
                                oldTransaction.id,
                            );

                        // Restore account balance from old account

                        const balanceRestored =
                            this.CalculateNewBalanceWhenRemove(
                                oldAccount.balance,
                                transaction.value,
                                transaction.type,
                            );

                        await this._bankAccountService.UpdateBalance(
                            oldAccount.id,
                            balanceRestored,
                            tx,
                        );

                        // Apply the new transaction value in the new account

                        const balance = this.CalculateNewBalanceWhenCreate(
                            newAccount.balance,
                            transaction.value,
                            transaction.type,
                        );

                        await this._bankAccountService.UpdateBalance(
                            newAccount.id,
                            balance,
                            tx,
                        );

                        return transaction;
                    }

                    if (
                        fieldsToChange.value &&
                        transaction.value != oldTransaction.value
                    ) {
                        this._logger.info(
                            `[${this.SERVICE_NAME}-${this.Update.name}] Updating value to transaction | UserId: ${userId} | TransactionId: ${transaction.id}`,
                            {
                                service_name: this.SERVICE_NAME,
                                method_name: this.Update.name,
                                userId,
                                transactionId: transaction.id,
                                fieldUpdated: "value",
                            },
                        );

                        const account = await this._bankAccountService.GetPerId(
                            transaction.bankAccountId,
                        );

                        const balance =
                            this.CalculateNewBalanceWhenValueIsUpdate(
                                transaction,
                                oldTransaction,
                                account,
                            );

                        await this._bankAccountService.UpdateBalance(
                            transaction.bankAccountId,
                            balance,
                            tx,
                        );
                    }

                    if (
                        fieldsToChange.type &&
                        transaction.type != oldTransaction.type
                    ) {
                        this._logger.info(
                            `[${this.SERVICE_NAME}-${this.Update.name}] Updating type to transaction | UserId: ${userId} | TransactionId: ${transaction.id}`,
                            {
                                service_name: this.SERVICE_NAME,
                                method_name: this.Update.name,
                                userId,
                                transactionId: transaction.id,
                                fieldUpdated: "type",
                            },
                        );

                        throw new BaseException("Condition not implemented");
                    }

                    return transaction;
                },
            );

            return transactionUpdated;
        } catch (err: unknown) {
            this._logger.error(
                `[${this.SERVICE_NAME}-${this.Update.name}] Error to create a new transaction | Error: ${err} | UserId: ${userId}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.Update.name,
                    userId: userId,
                    error: err,
                },
            );

            throw new BaseException(
                "An error occurred when updating the transaction",
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                err,
            );
        }
    }

    async Delete(id: string, userId: string): Promise<void> {
        const transaction = await this.GetPerId(id, userId);
        const account = await this._bankAccountService.GetPerId(
            transaction.bankAccountId,
        );

        const newBalance = this.CalculateNewBalanceWhenRemove(
            account.balance,
            transaction.value,
            transaction.type,
        );

        await this._prisma.$transaction(async (tx) => {
            await this._bankAccountService.UpdateBalance(
                transaction.bankAccountId,
                newBalance,
                tx,
            );

            await this._transactionRepository.Delete(id, tx);
        });
    }

    // Private methods

    /**
     * Calculates the new account balance when creating a transaction.
     *
     * If the transaction type is an entry, the transaction value is added to the account balance.
     * If the transaction type is not an entry (e.g., an exit), the transaction value is subtracted from the account balance.
     * Throws an exception if the transaction value exceeds the current account balance for non-entry transactions.
     *
     * @param accountBalance - The current balance of the account.
     * @param transactionValue - The value of the transaction to be applied.
     * @param transactionType - The type of the transaction (e.g., entry or exit).
     * @returns The new account balance after applying the transaction.
     * @throws {BaseException} If the transaction value is greater than the account balance for non-entry transactions.
     */
    private CalculateNewBalanceWhenCreate(
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

    /**
     * Calculates the new account balance when a transaction is deleted.
     *
     * If the transaction type is `Exit`, the transaction value is added back to the account balance.
     * Otherwise, the transaction value is subtracted from the account balance, unless the transaction value
     * exceeds the current balance, in which case an exception is thrown.
     *
     * @param accountBalance - The current balance of the account.
     * @param transactionValue - The value of the transaction being deleted.
     * @param transactionType - The type of the transaction (e.g., Entry or Exit).
     * @returns The new account balance after deleting the transaction.
     * @throws {BaseException} If the transaction value is greater than the account balance for non-Exit transactions.
     */
    private CalculateNewBalanceWhenRemove(
        accountBalance: number,
        transactionValue: number,
        transactionType: string,
    ): number {
        if (transactionType == TransactionType.Exit) {
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

    /**
     * Calculates the new account balance when a transaction's value is updated.
     *
     * This method determines the difference between the old and new transaction values,
     * and adjusts the account balance accordingly based on the transaction type (Entry or otherwise).
     * For Entry transactions, the balance increases or decreases depending on whether the value increased or decreased.
     * For other transaction types, the balance is adjusted inversely, and an exception is thrown if the resulting balance is negative.
     *
     * @param transaction - The updated transaction object.
     * @param oldTransaction - The original transaction object before the update.
     * @param account - The bank account associated with the transaction.
     * @returns The new calculated balance after applying the transaction update.
     * @throws BaseException If the resulting balance is negative for non-Entry transactions.
     */
    private CalculateNewBalanceWhenValueIsUpdate(
        transaction: Transaction,
        oldTransaction: Transaction,
        account: BankAccount,
    ): number {
        let balance: number;

        if (transaction.type == TransactionType.Entry) {
            if (transaction.value > oldTransaction.value) {
                const difference = transaction.value - oldTransaction.value;

                balance = account.balance + difference;
            } else {
                const difference = oldTransaction.value - transaction.value;

                balance = account.balance - difference;
            }
        } else {
            if (transaction.value > oldTransaction.value) {
                const difference = transaction.value - oldTransaction.value;

                balance = account.balance - difference;
            } else {
                const difference = oldTransaction.value - transaction.value;

                balance = account.balance + difference;
            }

            if (balance < 0) {
                throw new BaseException(
                    "Balance is negative",
                    HttpStatusCode.BAD_REQUEST,
                );
            }
        }

        return balance;
    }

    /**
     * Determines which fields in the transaction are being updated based on the provided data.
     *
     * Iterates over the possible transaction fields and checks if each field is present (not `undefined`)
     * in the `UpdateTransactionDto` object. Returns an object indicating which fields are to be changed.
     *
     * @param data - The data transfer object containing the fields to update in the transaction.
     * @returns An object with boolean flags for each transaction field, set to `true` if the field is present in `data`.
     */
    private VerifyWhatFieldsChange(
        data: UpdateTransactionDto,
    ): transactionFieldsToChange {
        const fieldsToChange: transactionFieldsToChange = {
            value: false,
            bankAccountId: false,
            expenseId: false,
            type: false,
            date: false,
        };

        for (const key of Object.keys(fieldsToChange)) {
            if (data[key as keyof UpdateTransactionDto] !== undefined) {
                fieldsToChange[key as keyof typeof fieldsToChange] = true;
            }
        }

        return fieldsToChange;
    }
}
