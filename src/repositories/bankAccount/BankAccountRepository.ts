import { BankAccount } from "@prisma/client";
import prisma from "../../configs/db/prisma";
import logger from "../../configs/logger/logger";
import BankAccountDto from "../../models/bankAccount/BankAccountDto";
import IBankAccountRepository from "./interfaces/IBankAccountRepository";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";

export default class BankAccountRepository implements IBankAccountRepository {
    private readonly METHOD_NAME = "BankAccountRepository";

    private readonly _logger = logger;
    private readonly _prisma = prisma;

    async GetAll(userId: string): Promise<BankAccount[]> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting all bank accounts from user | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId: userId,
            },
        );

        const bankAccounts = await this._prisma.bankAccount.findMany({
            where: { userId, active: true },
            include: {
                bank: true,
            },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] All user bank accounts were found with successfully | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId: userId,
            },
        );

        return bankAccounts;
    }

    async GetPerId(userId: string, id: string): Promise<BankAccount> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting bank account per ID | UserId: ${userId} | BankAccountId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: userId,
                bankAccountId: id,
            },
        );

        const bankAccount = await this._prisma.bankAccount.findUnique({
            where: { userId, id, active: true },
            include: { bank: true },
        });

        if (bankAccount == null) {
            this._logger.info(
                `[${this.METHOD_NAME}] Bank Account not founded | BankAccountId: ${id}`,
                {
                    method_name: this.METHOD_NAME,
                    userId: userId,
                    bankAccountId: id,
                },
            );

            throw new BaseException(
                "Bank Account not founded",
                HttpStatusCode.NOT_FOUND,
            );
        }

        this._logger.info(
            `[${this.METHOD_NAME}] Bank Account founded with successfully | BankAccountId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: userId,
                bankAccountId: id,
            },
        );

        return bankAccount;
    }

    async Create(userId: string, data: BankAccountDto): Promise<BankAccount> {
        this._logger.info(
            `[${this.METHOD_NAME}] Creating a new bank account for the user | UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                userId: userId,
            },
        );

        const bankAccount = await this._prisma.bankAccount.create({
            data: {
                ...data,
                userId,
            },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Bank account created with successfully | BankAccountId: ${bankAccount.id}, UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                bankAccountId: bankAccount.id,
            },
        );

        return bankAccount;
    }

    async Update(
        bankAccountId: string,
        userId: string,
        data: BankAccountDto,
    ): Promise<BankAccount> {
        this._logger.info(
            `[${this.METHOD_NAME}] Updating the bank account | BankAccountId: ${bankAccountId}, UserId: ${userId}`,
            {
                method_name: this.METHOD_NAME,
                bankAccountId,
                userId,
            },
        );

        const bankAccount = await this._prisma.bankAccount.update({
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

        this._logger.info(
            `[${this.METHOD_NAME}] Bank Account infos updated with successfully | UserId: ${userId}, BankAccountId: ${bankAccountId}`,
            {
                method_name: this.METHOD_NAME,
                bankAccountId,
                userId,
            },
        );

        return bankAccount;
    }

    async Delete(bankAccountId: string): Promise<void> {
        this._logger.info(
            `[${this.METHOD_NAME}] Deleting the bank account | BankAccountId: ${bankAccountId}`,
            {
                method_name: this.METHOD_NAME,
                bankAccountId,
            },
        );

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

        this._logger.info(
            `[${this.METHOD_NAME}] Bank Account deleted with successfully`,
            {
                method_name: this.METHOD_NAME,
                bankAccountId,
            },
        );
    }
}
