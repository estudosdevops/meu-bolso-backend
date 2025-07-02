import AuthRepository from "../../../repositories/auth/AuthRepository";
import { prismaMock } from "../../setup/setupPrisma";

// Type baseado no schema.prisma
type authenticationPrisma = {
    id: string;
    password: string;
    refreshToken: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date | null;
};

describe("Success AuthRepository methods", () => {
    const authRepository = new AuthRepository();

    const authenticationPrismaMock: authenticationPrisma = {
        id: "auth-123",
        password: "hashedpassword",
        refreshToken: "refresh-token-xyz",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    test("should get authentication by userId", async () => {
        prismaMock.authentication.findUnique.mockResolvedValue(
            authenticationPrismaMock,
        );

        const auth = await authRepository.GetPerUserId(
            authenticationPrismaMock.userId,
        );

        expect(auth).toEqual(authenticationPrismaMock);
    });

    test("should create authentication", async () => {
        prismaMock.authentication.create.mockResolvedValue(
            authenticationPrismaMock,
        );

        const auth = await authRepository.Create(
            authenticationPrismaMock.password,
            authenticationPrismaMock.userId,
        );

        expect(auth).toEqual(authenticationPrismaMock);
    });

    test("should update refresh token", async () => {
        const updatedAuthMock = {
            ...authenticationPrismaMock,
            refreshToken: "new-refresh-token",
            updatedAt: new Date(),
        };

        prismaMock.authentication.update.mockResolvedValue(updatedAuthMock);

        const auth = await authRepository.UpdateRefreshToken(
            updatedAuthMock.id,
            updatedAuthMock.userId,
            updatedAuthMock.refreshToken!,
        );

        expect(auth).toEqual(updatedAuthMock);
        expect(auth.refreshToken).toBe("new-refresh-token");
    });
});
