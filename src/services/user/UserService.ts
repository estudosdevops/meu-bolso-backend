import { User } from "@prisma/client";
import { encryptText } from "../../handlers/encryptText";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import { inject, injectable } from "tsyringe";

import logger from "../../configs/logger/logger";
import UserDto from "../../models/user/UserDto";
import BaseException from "../../models/bases/BaseException";

import IAuthRepository from "../../repositories/auth/interfaces/IAuthRepository";
import IUserService from "./interfaces/IUserService";
import IUserRepository from "../../repositories/user/interfaces/IUserRepository";

@injectable()
export default class UserService implements IUserService {
    constructor(
        @inject("IUserRepository")
        private readonly _userRepository: IUserRepository,

        @inject("IAuthRepository")
        private readonly _authRepository: IAuthRepository,
    ) {}

    private readonly _logger = logger;

    private readonly SERVICE_NAME = "UserService";

    async GetPerId(id: string): Promise<User> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] Getting user information per id | UserId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerId.name,
                userId: id,
            },
        );

        const user = await this._userRepository.GetPerId(id);

        if (user == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.GetPerId.name}] User not found | UserId: ${id}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.GetPerId.name,
                    userId: id,
                },
            );

            throw new BaseException("User not found", HttpStatusCode.NOT_FOUND);
        }

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerId.name}] User founded with successfully | UserId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerId.name,
                userId: id,
            },
        );

        return user;
    }

    async GetPerMail(email: string): Promise<User> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerMail.name}] Getting user information per email | Email: ${email}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerMail.name,
                userEmail: email,
            },
        );

        const user = await this._userRepository.GetPerMail(email);

        if (user == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.GetPerMail.name}] User not found | Email: ${email}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.GetPerMail.name,
                    userEmail: email,
                },
            );

            throw new BaseException("User not found", HttpStatusCode.NOT_FOUND);
        }

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.GetPerMail.name}] User founded with successfully | Email: ${email} | UserId: ${user.id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.GetPerMail.name,
                userEmail: email,
                userId: user.id,
            },
        );

        return user;
    }

    async Create(data: UserDto): Promise<User> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] Creating a new user | Email: ${data.email}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userEmail: data.email,
            },
        );

        const user = await this._userRepository.Create(data);

        await this.CreateAuthUserRelation(user.id, data.password);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Create.name}] User created with successfully | UserId: ${user.id} | Email: ${user.email}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Create.name,
                userId: user.id,
                userEmail: user.email,
            },
        );

        return user;
    }

    async Update(data: UserDto, id: string): Promise<User> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] Updating user informations | UserId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                userId: id,
            },
        );

        await this.HasUserInDatabase(id);

        const user = await this._userRepository.Update(data, id);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Update.name}] User updated with successfully | UserId: ${user.id} | Email: ${user.email}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Update.name,
                userId: user.id,
                userEmail: user.email,
            },
        );

        return user;
    }

    async Delete(id: string): Promise<void> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] Deleting user | UserId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
                userId: id,
            },
        );

        await this.HasUserInDatabase(id);

        await this._userRepository.Delete(id);

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.Delete.name}] User deleted | UserId: ${id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.Delete.name,
                userId: id,
            },
        );
    }

    // Private methods

    private async HasUserInDatabase(id: string): Promise<void> {
        const user = await this._userRepository.GetPerId(id);

        if (user == null) {
            this._logger.info(
                `[${this.SERVICE_NAME}-${this.HasUserInDatabase.name}] User not found | UserId: ${id}`,
                {
                    service_name: this.SERVICE_NAME,
                    method_name: this.HasUserInDatabase.name,
                    userId: id,
                },
            );

            throw new BaseException("User not found", HttpStatusCode.NOT_FOUND);
        }
    }

    private async CreateAuthUserRelation(
        userId: string,
        password: string,
    ): Promise<void> {
        this._logger.info(
            `[${this.SERVICE_NAME}-${this.CreateAuthUserRelation.name}] Creating the auth relation | UserId: ${userId}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.CreateAuthUserRelation.name,
                userId,
            },
        );

        const passwordEncrypted = await encryptText(password);

        const auth = await this._authRepository.Create(
            passwordEncrypted,
            userId,
        );

        this._logger.info(
            `[${this.SERVICE_NAME}-${this.CreateAuthUserRelation.name}] Created the auth relation with success | UserId: ${userId} | AuthId: ${auth.id}`,
            {
                service_name: this.SERVICE_NAME,
                method_name: this.CreateAuthUserRelation.name,
                userId,
                authId: auth.id,
            },
        );
    }
}
