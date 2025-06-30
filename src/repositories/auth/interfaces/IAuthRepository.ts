import { Authentication } from "@prisma/client";

export default interface IAuthRepository {
    GetPerUserId(userId: string): Promise<Authentication | null>;

    Create(password: string, userId: string): Promise<Authentication>;

    UpdateRefreshToken(
        id: string,
        userId: string,
        refreshToken: string,
    ): Promise<Authentication>;
}
