import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import { compareTextWithHash } from "../../handlers/encryptText";
import { USER_NOT_FOUND_MESSAGE } from "../../models/utils/Constants";

import AuthService from "../../services/auth/AuthService";
import BaseException from "../../models/bases/BaseException";
import AuthResponse from "../../models/auth/AuthResponse";
import IUserRepository from "../../repositories/user/interfaces/IUserRepository";
import IAuthRepository from "../../repositories/auth/interfaces/IAuthRepository";

// Mocks
jest.mock("../../handlers/encryptText", () => ({
    compareTextWithHash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "jwt-token"),
}));

jest.mock("../../configs/secrets", () => ({
    __esModule: true,
    default: {
        jwt: {
            secret: "secret",
            expiresIn: "1h",
        },
    },
}));

type userPrisma = {
    id: string;
    name: string;
    email: string;
    cpf: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date | null;
};

type authenticationPrisma = {
    id: string;
    password: string;
    refreshToken: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date | null;
};

describe("Login method tests", () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockAuthRepository: jest.Mocked<IAuthRepository>;
    let authService: AuthService;

    const userMock: userPrisma = {
        id: "user-123",
        name: "Jane Doe",
        email: "jane@email.com",
        cpf: "01234567890",
        active: true,
        createdAt: new Date(),
        updatedAt: null,
    };

    const authMock: authenticationPrisma = {
        id: "auth-123",
        password: "hashedpassword",
        refreshToken: "refresh-token-xyz",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    beforeEach(() => {
        mockUserRepository = {
            GetPerId: jest.fn(),
            GetPerMail: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        mockAuthRepository = {
            Create: jest.fn(),
            GetPerUserId: jest.fn(),
            UpdateRefreshToken: jest.fn(),
        };

        authService = new AuthService(mockUserRepository, mockAuthRepository);
        jest.clearAllMocks();
    });

    test("Should be authenticate and return AuthResponse with token and refreshToken", async () => {
        mockUserRepository.GetPerMail.mockResolvedValue(userMock);

        mockAuthRepository.GetPerUserId.mockResolvedValue(authMock);

        (compareTextWithHash as jest.Mock).mockResolvedValue(true);

        mockAuthRepository.UpdateRefreshToken.mockResolvedValue({
            ...authMock,
            refreshToken: "new-refresh-token",
        });

        const result = await authService.Login(
            userMock.email,
            "correct-password",
        );

        expect(result).toBeInstanceOf(AuthResponse);
        expect(result.accessToken).toBe("jwt-token");
        expect(result.refreshToken).toBe("new-refresh-token");
        expect(result.expiration).toBe("1h");
    });

    test("Should be throw an BaseException if user is not found", async () => {
        mockUserRepository.GetPerMail.mockResolvedValue(null);

        await expect(
            authService.Login("notfound@email.com", "password"),
        ).rejects.toEqual(
            new BaseException(USER_NOT_FOUND_MESSAGE, HttpStatusCode.NOT_FOUND),
        );
    });

    test("Should be throw an BaseException if auth is not found", async () => {
        mockUserRepository.GetPerMail.mockResolvedValue(userMock);
        mockAuthRepository.GetPerUserId.mockResolvedValue(null);

        await expect(
            authService.Login(userMock.email, "password"),
        ).rejects.toEqual(
            new BaseException(
                "Auth table to user not exists",
                HttpStatusCode.NOT_FOUND,
            ),
        );
    });

    test("Should be throw an BaseException if password is incorrect", async () => {
        mockUserRepository.GetPerMail.mockResolvedValue(userMock);
        mockAuthRepository.GetPerUserId.mockResolvedValue(authMock);
        (compareTextWithHash as jest.Mock).mockResolvedValue(false);

        await expect(
            authService.Login(userMock.email, "wrong-password"),
        ).rejects.toEqual(
            new BaseException(
                "Password incorrect",
                HttpStatusCode.UNAUTHORIZED,
            ),
        );
    });
});

describe("Refresh method tests", () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockAuthRepository: jest.Mocked<IAuthRepository>;
    let authService: AuthService;

    const userMock: userPrisma = {
        id: "user-123",
        name: "Jane Doe",
        email: "jane@email.com",
        cpf: "01234567890",
        active: true,
        createdAt: new Date(),
        updatedAt: null,
    };

    const authMock: authenticationPrisma = {
        id: "auth-123",
        password: "hashedpassword",
        refreshToken: "refresh-token-xyz",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    beforeEach(() => {
        mockUserRepository = {
            GetPerId: jest.fn(),
            GetPerMail: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        mockAuthRepository = {
            Create: jest.fn(),
            GetPerUserId: jest.fn(),
            UpdateRefreshToken: jest.fn(),
        };

        authService = new AuthService(mockUserRepository, mockAuthRepository);
        jest.clearAllMocks();
    });

    test("Should generate a new refreshToken with userId is valid", async () => {
        mockUserRepository.GetPerId.mockResolvedValue(userMock);
        mockAuthRepository.GetPerUserId.mockResolvedValue(authMock);
        mockAuthRepository.UpdateRefreshToken.mockResolvedValue({
            ...authMock,
            refreshToken: "new-refresh-token",
        });

        const expectedResponse = new AuthResponse(
            "jwt-token",
            "new-refresh-token",
            300,
        );
        const generateTokenSpy = jest
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .spyOn(authService as any, "GenerateToken")
            .mockResolvedValue(expectedResponse);

        const result = await authService.Refresh(
            authMock.refreshToken!,
            userMock.id,
        );

        expect(result).toEqual(expectedResponse);
        expect(mockUserRepository.GetPerId).toHaveBeenCalledWith(userMock.id);
        expect(mockAuthRepository.GetPerUserId).toHaveBeenCalledWith(
            userMock.id,
        );
        expect(generateTokenSpy).toHaveBeenCalledWith(authMock, userMock);
    });

    test("Should throw a new BaseException if user is not found", async () => {
        mockUserRepository.GetPerId.mockResolvedValue(null);

        await expect(
            authService.Refresh(authMock.refreshToken!, userMock.id),
        ).rejects.toEqual(
            new BaseException(USER_NOT_FOUND_MESSAGE, HttpStatusCode.NOT_FOUND),
        );
    });

    test("Should throw a new BaseException if auth is not found", async () => {
        mockUserRepository.GetPerId.mockResolvedValue(userMock);
        mockAuthRepository.GetPerUserId.mockResolvedValue(null);

        await expect(
            authService.Refresh(authMock.refreshToken!, userMock.id),
        ).rejects.toEqual(
            new BaseException(
                "Auth table to user not exists",
                HttpStatusCode.NOT_FOUND,
            ),
        );
    });

    test("Should throw a new BaseException if refreshToken sended is invalid", async () => {
        mockUserRepository.GetPerId.mockResolvedValue(userMock);
        mockAuthRepository.GetPerUserId.mockResolvedValue({
            ...authMock,
            refreshToken: "another-refresh-token",
        });

        await expect(
            authService.Refresh(authMock.refreshToken!, userMock.id),
        ).rejects.toEqual(
            new BaseException(
                "Refresh token is invalid",
                HttpStatusCode.UNAUTHORIZED,
            ),
        );
    });
});
