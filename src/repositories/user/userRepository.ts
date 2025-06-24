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
            `[${this.METHOD_NAME}] Getting user information per id | UserId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );

        const user = await this._prisma.user.findUnique({
            where: {
                id,
                active: true,
            },
        });

        if (user == null) {
            this._logger.info(
                `[${this.METHOD_NAME}] User not found | UserId: ${id}`,
                {
                    method_name: this.METHOD_NAME,
                    userId: id,
                },
            );

            throw new BaseException("User not found", HttpStatusCode.NOT_FOUND);
        }

        this._logger.info(
            `[${this.METHOD_NAME}] User founded with successfully | UserId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );

        return user;
    }

    async GetPerMail(email: string): Promise<User> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting user information per email | Email: ${email}`,
            {
                method_name: this.METHOD_NAME,
                userEmail: email,
            },
        );

        const user = await this._prisma.user.findUnique({
            where: {
                email,
                active: true,
            },
        });

        if (user == null) {
            this._logger.info(
                `[${this.METHOD_NAME}] User not found | Email: ${email}`,
                {
                    method_name: this.METHOD_NAME,
                    userEmail: email,
                },
            );

            throw new BaseException("User not found", HttpStatusCode.NOT_FOUND);
        }

        this._logger.info(
            `[${this.METHOD_NAME}] User founded with successfully | Email: ${email}, UserId: ${user.id}`,
            {
                method_name: this.METHOD_NAME,
                userEmail: email,
                userId: user.id,
            },
        );

        return user;
    }

    async Create(data: UserDto): Promise<User> {
        this._logger.info(
            `[${this.METHOD_NAME}] Creating a new user | User email: ${data.email}`,
            {
                method_name: this.METHOD_NAME,
                userEmail: data.email,
            },
        );

        const user = await this._prisma.user.create({
            data,
        });

        this._logger.info(
            `[${this.METHOD_NAME}] User created with successfully | User ID: ${user.id} | User email: ${user.email}`,
            {
                method_name: this.METHOD_NAME,
                userId: user.id,
                userEmail: user.email,
            },
        );

        return user;
    }

    async Update(data: UserDto, id: string): Promise<User> {
        this._logger.info(
            `[${this.METHOD_NAME}] Updating user informations | User ID: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );

        const user = await this._prisma.user.update({
            where: {
                id,
                active: true,
            },
            data: {
                ...data,
                updatedAt: Date.now().toString(),
            },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] User updated with successfully | User ID: ${user.id} | User email: ${user.email}`,
            {
                method_name: this.METHOD_NAME,
                userId: user.id,
                userEmail: user.email,
            },
        );

        return user;
    }

    async Delete(id: string): Promise<void> {
        this._logger.info(
            `[${this.METHOD_NAME}] Deleting user | User ID: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );

        await this._prisma.user.update({
            where: { id, active: true },
            data: {
                active: false,
                updatedAt: Date.now().toString(),
            },
        });

        this._logger.info(
            `[${this.METHOD_NAME}] User deleted | User ID: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );
    }
}
