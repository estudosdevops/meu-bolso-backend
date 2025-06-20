/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from "@prisma/client";
import UserDto from "../../models/user/UserDto";
import IUserRepository from "./interfaces/IUserRepository";
import logger from "../../configs/logger/logger";
import prisma from "../../configs/db/prisma";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";

export default class UserRepository implements IUserRepository {
    private readonly METHOD_NAME = "UserRepository";

    private readonly _logger = logger;
    private readonly _prisma = prisma;

    async GetPerId(id: string): Promise<User> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting user information per id | UseId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );

        const user = await this._prisma.user.findUnique({
            where: { id },
        });

        if (user == null) {
            this._logger.info(
                `[${this.METHOD_NAME}] User not found | UseId: ${id}`,
                {
                    method_name: this.METHOD_NAME,
                    userId: id,
                },
            );

            throw new BaseException("User not found", HttpStatusCode.NOT_FOUND);
        }

        return user;
    }

    async GetPerMail(email: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async Create(data: UserDto): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async Update(data: UserDto, id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async Delete(id: string): Promise<""> {
        throw new Error("Method not implemented.");
    }
}
