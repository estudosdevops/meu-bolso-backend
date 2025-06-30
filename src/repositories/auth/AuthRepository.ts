import { Authentication } from "@prisma/client";
import IAuthRepository from "./interfaces/IAuthRepository";
import prisma from "../../configs/db/prisma";
import { encryptText } from "../../handlers/encryptText";

export default class AuthRepository implements IAuthRepository {
    private readonly _prisma = prisma;

    async GetPerUserId(userId: string): Promise<Authentication | null> {
        return await this._prisma.authentication.findUnique({
            where: { userId },
        });
    }

    async Create(password: string, userId: string): Promise<Authentication> {
        const passwordEncrypted = await encryptText(password);

        return await this._prisma.authentication.create({
            data: {
                password: passwordEncrypted,
                userId: userId,
            },
        });
    }

    async UpdateRefreshToken(
        id: string,
        userId: string,
        refreshToken: string,
    ): Promise<Authentication> {
        return await this._prisma.authentication.update({
            where: {
                id,
                userId,
            },
            data: {
                refreshToken,
            },
        });
    }
}
