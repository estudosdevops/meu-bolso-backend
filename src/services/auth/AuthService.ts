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
import { User } from "@prisma/client";
import secrets from "../../configs/secrets";
import { jwtPayload } from "../../types/jwtPayload";

@injectable()
export default class AuthService implements IAuthService {
    constructor(
        @inject("IUserRepository")
        private readonly _userRepository: IUserRepository,
    ) {}

    private readonly _logger = logger;

    private readonly METHOD_NAME = "AuthService";

    async Login(email: string, password: string): Promise<AuthResponse> {
        const user = await this._userRepository.GetPerMail(email);

        if (user == null) {
            this._logger.info(
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

        const hasCorrectPassword = await compareTextWithHash(
            password,
            user.password,
        );

        if (!hasCorrectPassword) {
            this._logger.info(
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

        return await this.GenerateToken(user);
    }

    // Private methods
    private async GenerateToken(user: User): Promise<AuthResponse> {
        const payload: jwtPayload = {
            id: user.id,
            name: user.name,
        };

        const token = sign(payload, secrets.jwt.secret, {
            expiresIn: secrets.jwt.expiresIn,
        });

        return new AuthResponse(token, this.random(64), secrets.jwt.expiresIn);
    }

    private async RefreshToken(
        token: string,
        refreshToken: string,
    ): Promise<boolean> {
        throw new Error(`${token} ${refreshToken}`);
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
