import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import { USER_NOT_FOUND_MESSAGE } from "../../models/utils/Constants";
import { compareTextWithHash } from "../../handlers/encryptText";
import { sign } from "jsonwebtoken";

import AuthResponse from "../../models/auth/AuthResponse";
import IAuthService from "./interfaces/IAuthService";
import IUserRepository from "../../repositories/user/interfaces/IUserRepository";
import logger from "../../configs/logger/logger";
import BaseException from "../../models/bases/BaseException";
import { Authentication, User } from "@prisma/client";
import secrets from "../../configs/secrets";
import { jwtPayload } from "../../types/jwtPayload";
import IAuthRepository from "../../repositories/auth/interfaces/IAuthRepository";

@injectable()
export default class AuthService implements IAuthService {
    constructor(
        @inject("IUserRepository")
        private readonly _userRepository: IUserRepository,

        @inject("IAuthRepository")
        private readonly _authRepository: IAuthRepository,
    ) {}

    private readonly RANDOM_NUMBER = 64;

    private readonly _logger = logger;

    private readonly METHOD_NAME = "AuthService";

    async Login(email: string, password: string): Promise<AuthResponse> {
        const user = await this._userRepository.GetPerMail(email);

        if (user == null) {
            this._logger.warn(
                `[${this.METHOD_NAME}] ${USER_NOT_FOUND_MESSAGE} | Email: ${email}`,
                {
                    method_name: this.METHOD_NAME,
                    userEmail: email,
                },
            );

            throw new BaseException(
                USER_NOT_FOUND_MESSAGE,
                HttpStatusCode.NOT_FOUND,
            );
        }

        const auth = await this._authRepository.GetPerUserId(user.id);

        if (auth == undefined) {
            this._logger.warn(
                `[${this.METHOD_NAME}] Auth table to user not exists | UserId: ${user.id}`,
                {
                    method_name: this.METHOD_NAME,
                    userEmail: email,
                    userId: user.id,
                },
            );

            throw new BaseException(
                "Auth table to user not exists",
                HttpStatusCode.NOT_FOUND,
            );
        }

        const hasCorrectPassword = await compareTextWithHash(
            password,
            auth.password,
        );

        if (!hasCorrectPassword) {
            this._logger.warn(
                `[${this.METHOD_NAME}] User password is incorrect | Email: ${email}`,
                {
                    method_name: this.METHOD_NAME,
                    userEmail: email,
                },
            );

            throw new BaseException(
                "Password incorrect",
                HttpStatusCode.UNAUTHORIZED,
            );
        }

        return await this.GenerateToken(auth, user);
    }

    async Refresh(refreshToken: string, userId: string): Promise<AuthResponse> {
        const user = await this._userRepository.GetPerId(userId);

        if (user == null) {
            this._logger.warn(
                `[${this.METHOD_NAME}] ${USER_NOT_FOUND_MESSAGE} | UserId: ${userId}`,
                {
                    method_name: this.METHOD_NAME,
                    userId,
                },
            );

            throw new BaseException(
                USER_NOT_FOUND_MESSAGE,
                HttpStatusCode.NOT_FOUND,
            );
        }

        const auth = await this._authRepository.GetPerUserId(userId);

        if (auth == null) {
            this._logger.warn(
                `[${this.METHOD_NAME}] Auth table to user not exists | UserId: ${userId}`,
                {
                    method_name: this.METHOD_NAME,
                    userId,
                },
            );

            throw new BaseException(
                "Auth table to user not exists",
                HttpStatusCode.NOT_FOUND,
            );
        }

        if (auth.refreshToken != refreshToken) {
            this._logger.warn(
                `[${this.METHOD_NAME}] Refresh token is invalid | UserId: ${userId}`,
                {
                    method_name: this.METHOD_NAME,
                    userId,
                },
            );

            throw new BaseException(
                "Refresh token is invalid",
                HttpStatusCode.UNAUTHORIZED,
            );
        }

        return await this.GenerateToken(auth, user);
    }

    // Private methods
    private async GenerateToken(
        auth: Authentication,
        user: User,
    ): Promise<AuthResponse> {
        const payload: jwtPayload = {
            id: user.id,
            name: user.name,
        };

        const token = sign(payload, secrets.jwt.secret, {
            expiresIn: secrets.jwt.expiresIn,
        });

        const refreshToken = await this._authRepository.UpdateRefreshToken(
            auth.id,
            user.id,
            this.random(this.RANDOM_NUMBER),
        );

        return new AuthResponse(
            token,
            refreshToken.refreshToken ?? "",
            secrets.jwt.expiresIn,
        );
    }

    private random(length: number): string {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength),
            );
        }

        return result;
    }
}
