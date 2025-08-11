import { Bank } from "@prisma/client";
import { inject, injectable } from "tsyringe";

import IBankService from "./interfaces/IBankService";
import IBankRepository from "../../repositories/bank/interfaces/IBankRepository";

import BankDto from "../../models/bank/bankDto";

import logger from "../../configs/logger/logger";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";

@injectable()
export default class BankService implements IBankService {
    constructor(
        @inject("IBankRepository")
        private readonly _bankRepository: IBankRepository,
    ) {}

    private readonly _logger = logger;

    private readonly SERVICE_NAME = "BankService";

    async GetAll(userId: string): Promise<Bank[]> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Getting all user banks | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        const banks = await this._bankRepository.GetAll(userId);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetAll.name}] Retrieved ${banks.length} banks from user account | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetAll.name,
                userId,
            },
        );

        return banks;
    }

    async Create(data: BankDto): Promise<Bank> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] Create a new bank in user account | UserId: ${data.userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userId: data.userId,
            },
        );

        const bank = await this._bankRepository.Create(data);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] New bank created with successfully | UserId: ${data.userId} | BankId: ${bank.id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userId: data.userId,
                bankId: bank.id,
            },
        );

        return bank;
    }

    async Update(data: BankDto, id: string): Promise<Bank> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Update a bank in user account | UserId: ${data.userId} | BankId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                userId: data.userId,
                bankId: id,
            },
        );

        await this.VerifyIfBankExists(id);

        const bank = await this._bankRepository.Update(data, id);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Bank updated with successfully | UserId: ${data.userId} | BankId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userId: data.userId,
                bankId: id,
            },
        );

        return bank;
    }

    async Delete(id: string): Promise<void> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] Deleting a bank in user account | BankId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
                bankId: id,
            },
        );

        await this.VerifyIfBankExists(id);

        await this._bankRepository.Delete(id);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] Bank deleted with successfully`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
            },
        );
    }

    // Private methods

    private async VerifyIfBankExists(id: string): Promise<void> {
        const bank = await this._bankRepository.GetPerId(id);

        if (bank == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.VerifyIfBankExists.name}] Bank not found | BankId: ${id}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.VerifyIfBankExists.name,
                    bankId: id,
                },
            );

            throw new BaseException("Bank not found", HttpStatusCode.NOT_FOUND);
        }
    }
}
