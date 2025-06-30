import { Authentication } from "@prisma/client";
import IAuthRepository from "./interfaces/IAuthRepository";
import prisma from "../../configs/db/prisma";

export default class AuthRepository implements IAuthRepository {
    private readonly _prisma = prisma;

    async GetPerUserId(userId: string): Promise<Authentication | null> {
        return await this._prisma.authentication.findUnique({
            where: { userId },
        });
    }

    async Create(password: string, userId: string): Promise<Authentication> {
        return await this._prisma.authentication.create({
            data: {
                password,
                userId,
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
