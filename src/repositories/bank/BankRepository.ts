import { Bank } from "@prisma/client";
import IBankRepository from "./interfaces/IBankRepository";
import BankDto from "../../models/bank/bankDto";
import prisma from "../../configs/db/prisma";
import logger from "../../configs/logger/logger";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";

export default class BankRepository implements IBankRepository {
    private readonly METHOD_NAME = "BankRepository";

    private readonly _prisma = prisma;
    private readonly _logger = logger;

    async GetPerId(id: string): Promise<Bank> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting the bank informations | BankId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                bankId: id,
            },
        );

        const bank = await this._prisma.bank.findUnique({
            where: { id },
        });

        if (bank == null) {
            this._logger.info(
                `[${this.METHOD_NAME}] Bank not founded | BankId: ${id}`,
                {
                    method_name: this.METHOD_NAME,
                    bankId: id,
                },
            );

            throw new BaseException(
                "Bank not founded",
                HttpStatusCode.NOT_FOUND,
            );
        }

        return bank;
    }

    async Update(data: BankDto, id: string): Promise<Bank> {
        this._logger.info(
            `[${this.METHOD_NAME}] Updating the bank informations | BankId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                bankId: id,
            },
        );

        const bank = await this._prisma.bank.update({
            where: { id },
            data,
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Bank informations updated with successfully | BankId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                bankId: id,
            },
        );

        return bank;
    }

    async Delete(id: string): Promise<void> {
        this._logger.info(
            `[${this.METHOD_NAME}] Deleting the bank | BankId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                bankId: id,
            },
        );

        await this._prisma.bank.delete({
            where: { id },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Bank deleted with successfully`,
            {
                method_name: this.METHOD_NAME,
            },
        );
    }

    async Create(data: BankDto): Promise<Bank> {
        this._logger.info(`[${this.METHOD_NAME}] Creating a new bank`, {
            method_name: this.METHOD_NAME,
        });

        const bank = await this._prisma.bank.create({
            data,
        });

        this._logger.info(
            `[${this.METHOD_NAME}] Bank created with successfully | BankId: ${bank.id}`,
            {
                method_name: this.METHOD_NAME,
                bankId: bank.id,
            },
        );

        return bank;
    }
}
