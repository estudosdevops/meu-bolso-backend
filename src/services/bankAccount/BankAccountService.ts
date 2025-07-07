import { BankAccount } from "@prisma/client";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import { inject, injectable } from "tsyringe";

import BankAccountDto from "../../models/bankAccount/BankAccountDto";
import IBankAccountService from "./interfaces/IBankAccountService";
import IBankAccountRepository from "../../repositories/bankAccount/interfaces/IBankAccountRepository";

import logger from "../../configs/logger/logger";
import BaseException from "../../models/bases/BaseException";
import IBankRepository from "../../repositories/bank/interfaces/IBankRepository";

@injectable()
export default class BankAccountService implements IBankAccountService {
    constructor(
        @inject("IBankAccountRepository")
        private readonly _bankAccountRepository: IBankAccountRepository,

        @inject("IBankRepository")
        private readonly _bankRepository: IBankRepository,
    ) {}

    private readonly _logger = logger;

    private readonly SERVICE_NAME = "BankAccountService";

    async GetAll(userId: string): Promise<BankAccount[]> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Gettering all user bank accounts | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        const accounts = await this._bankAccountRepository.GetAll(userId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Retrieved ${accounts.length} user bank accounts with successfully | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        return accounts;
    }

    async GetPerId(accountId: string): Promise<BankAccount> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] Getting the user bank account | BankAccountId: ${accountId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                bankAccountId: accountId,
            },
        );

        const account = await this._bankAccountRepository.GetPerId(accountId);

        if (account == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.GetPerId.name}] Bank Account not found | BankAccountId: ${accountId}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.GetAll.name,
                    bankAccountId: accountId,
                },
            );

            throw new BaseException(
                "Bank account not found",
                HttpStatusCode.NOT_FOUND,
            );
        }

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] Bank account founded with successfully | BankAccountId: ${accountId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                bankAccountId: accountId,
            },
        );

        return account;
    }

    async Create(data: BankAccountDto): Promise<BankAccount> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] Creating a new bank account | UserId: ${data.userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userId: data.userId,
            },
        );

        await this.ValidateIfBankExists(data.bankId);

        const account = await this._bankAccountRepository.Create(data);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] Bank account created with successfully | UserId: ${data.userId} | BankAccountId: ${account.id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userId: data.userId,
                bankAccountId: account.id,
            },
        );

        return account;
    }

    async Update(
        accountId: string,
        data: BankAccountDto,
    ): Promise<BankAccount> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Updating a bank account | UserId: ${data.userId} | BankAccountId: ${accountId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                userId: data.userId,
                bankAccountId: accountId,
            },
        );

        await this.ValidateIfBankAccountExists(accountId);

        await this.ValidateIfBankExists(data.bankId);

        const account = await this._bankAccountRepository.Update(
            accountId,
            data.userId,
            data,
        );

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Bank account updated with succesfully | UserId: ${data.userId} | BankAccountId: ${accountId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                userId: data.userId,
                bankAccountId: accountId,
            },
        );

        return account;
    }

    async UpdateBalance(
        accountId: string,
        balance: number,
    ): Promise<BankAccount> {
        await this.ValidateIfBankAccountExists(accountId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.UpdateBalance.name}] Updating bank account balance | BankAccountId: ${accountId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.UpdateBalance.name,
                bankAccountId: accountId,
            },
        );

        const account = await this._bankAccountRepository.UpdateBalance(
            accountId,
            balance,
        );

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.UpdateBalance.name}] Bank account balance updated with successfully | BankAccountId: ${accountId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.UpdateBalance.name,
                bankAccountId: accountId,
            },
        );

        return account;
    }

    async Delete(accountId: string): Promise<void> {
        await this.ValidateIfBankAccountExists(accountId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] Deleting bank account | BankAccountId: ${accountId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
                bankAccountId: accountId,
            },
        );

        await this._bankAccountRepository.Delete(accountId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] Bank account deleted with successfully | BankAccountId: ${accountId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
                bankAccountId: accountId,
            },
        );
    }

    // Private methods

    private async ValidateIfBankAccountExists(
        accountId: string,
    ): Promise<void> {
        const account = await this._bankAccountRepository.GetPerId(accountId);

        if (account == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.ValidateIfBankAccountExists.name}] Bank Account not found | BankAccountId: ${accountId}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.ValidateIfBankAccountExists.name,
                    bankAccountId: accountId,
                },
            );

            throw new BaseException(
                "Bank account not found",
                HttpStatusCode.NOT_FOUND,
            );
        }
    }

    private async ValidateIfBankExists(bankId: string): Promise<void> {
        const bank = await this._bankRepository.GetPerId(bankId);

        if (bank == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.ValidateIfBankExists.name}] Bank not found | BankId: ${bankId}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.ValidateIfBankExists.name,
                    bankId,
                },
            );

            throw new BaseException(
                "Bank not found, please verify if is registered in user account",
                HttpStatusCode.BAD_REQUEST,
            );
        }
    }
}
