import { User } from "@prisma/client";
import IUserService from "./interfaces/IUserService";
import IUserRepository from "../../repositories/user/interfaces/IUserRepository";
import { inject, injectable } from "tsyringe";
import logger from "../../configs/logger/logger";
import UserDto from "../../models/user/UserDto";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import { encryptText } from "../../handlers/encryptText";

@injectable()
export default class UserService implements IUserService {
    constructor(
        @inject("IUserRepository")
        private readonly _userRepository: IUserRepository,
    ) {}

    private readonly _logger = logger;

    private readonly METHOD_NAME = "UserService";

    async GetPerId(id: string): Promise<User> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting user information per id | UserId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );

        const user = await this._userRepository.GetPerId(id);

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

        const user = await this._userRepository.GetPerMail(email);

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

        const passwordEncrypted = await encryptText(data.password);

        data.password = passwordEncrypted;

        const user = await this._userRepository.Create(data);

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

        await this.HasUserInDatabase(id);

        const user = await this._userRepository.Update(data, id);

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

        await this.HasUserInDatabase(id);

        await this._userRepository.Delete(id);

        this._logger.info(
            `[${this.METHOD_NAME}] User deleted | User ID: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );
    }

    private async HasUserInDatabase(id: string): Promise<void> {
        const user = await this._userRepository.GetPerId(id);

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
    }
}
