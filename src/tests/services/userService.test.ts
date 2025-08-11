import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import IAuthRepository from "../../repositories/auth/interfaces/IAuthRepository";
import IUserRepository from "../../repositories/user/interfaces/IUserRepository";
import UserService from "../../services/user/UserService";

type userPrisma = {
    id: string;
    active: boolean;
    cpf: string;
    createdAt: Date;
    name: string;
    email: string;
    updatedAt: Date | null;
};

const USER_NOT_FOUND_MESSAGE = "User not found";

describe("Tests involved the Get methods", () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockAuthRepository: jest.Mocked<IAuthRepository>;
    let userService: UserService;

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

        userService = new UserService(mockUserRepository, mockAuthRepository);
    });

    test("Should receive a User when get user from userRepository.GetPerId", async () => {
        const userPrismaMock: userPrisma = {
            id: "b6bec75e-3878-42e6-98c6-8e2d60fe044b",
            active: true,
            cpf: "01234567890",
            createdAt: new Date(),
            name: "Jane Doe",
            email: "jane@email.com",
            updatedAt: null,
        };

        mockUserRepository.GetPerId.mockResolvedValue(userPrismaMock);

        const user = await userService.GetPerId(
            "b6bec75e-3878-42e6-98c6-8e2d60fe044b",
        );

        expect(user).not.toBeNull();
        expect(user).toEqual(userPrismaMock);
    });

    test("Should receive a User when get user from userRepository.GetPerMail", async () => {
        const userPrismaMock: userPrisma = {
            id: "b6bec75e-3878-42e6-98c6-8e2d60fe044b",
            active: true,
            cpf: "01234567890",
            createdAt: new Date(),
            name: "Jane Doe",
            email: "jane@email.com",
            updatedAt: null,
        };

        mockUserRepository.GetPerMail.mockResolvedValue(userPrismaMock);

        const user = await userService.GetPerMail("jane@email.com");

        expect(user).not.toBeNull();
        expect(user).toEqual(userPrismaMock);
    });

    test("Should throw a BaseException when receive a null from userRepository.GetPerId", async () => {
        mockUserRepository.GetPerId.mockResolvedValue(null);

        await expect(userService.GetPerId("some-id")).rejects.toThrow(
            new BaseException(USER_NOT_FOUND_MESSAGE, HttpStatusCode.NOT_FOUND),
        );
    });

    test("Should throw a BaseException when receive a null from userRepository.GetPerMail", async () => {
        mockUserRepository.GetPerMail.mockResolvedValue(null);

        await expect(userService.GetPerMail("some-id")).rejects.toThrow(
            new BaseException(USER_NOT_FOUND_MESSAGE, HttpStatusCode.NOT_FOUND),
        );
    });
});

describe("Tests involved the create method", () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockAuthRepository: jest.Mocked<IAuthRepository>;

    let userService: UserService;

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

        userService = new UserService(mockUserRepository, mockAuthRepository);
    });

    test("Should create a new user and returned him", async () => {
        const userPrismaMock: userPrisma = {
            id: "b6bec75e-3878-42e6-98c6-8e2d60fe044b",
            active: true,
            cpf: "01234567890",
            createdAt: new Date(),
            name: "Jane Doe",
            email: "jane@email.com",
            updatedAt: null,
        };

        const authPrismaMock = {
            id: "e2cfd178-cc6c-4d79-8c56-58cd80f57854",
            password: "strongPasswordEncrypted",
            refreshToken: null,
            createdAt: new Date(),
            updatedAt: null,
            userId: "b6bec75e-3878-42e6-98c6-8e2d60fe044b",
        };

        mockAuthRepository.Create.mockResolvedValue(authPrismaMock);
        mockUserRepository.Create.mockResolvedValue(userPrismaMock);

        const userMock = {
            name: "Jane Doe",
            email: "jane@email.com",
            password: "strongPassword",
            cpf: "01234567890",
        };

        const user = await userService.Create(userMock);

        expect(user).toEqual(userPrismaMock);
    });
});

describe("Tests involved the update method", () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockAuthRepository: jest.Mocked<IAuthRepository>;
    let userService: UserService;

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

        userService = new UserService(mockUserRepository, mockAuthRepository);
    });

    test("Should update a existing user and returned him updated", async () => {
        const userPrismaMock: userPrisma = {
            id: "b6bec75e-3878-42e6-98c6-8e2d60fe044b",
            active: true,
            cpf: "01234567890",
            createdAt: new Date(),
            name: "Jane Doe",
            email: "jane@email.com",
            updatedAt: null,
        };

        const userPrismaMockUpdated = { ...userPrismaMock };

        userPrismaMockUpdated.email = "janedoe@email.com";
        userPrismaMockUpdated.updatedAt = new Date();

        mockUserRepository.Update.mockResolvedValue(userPrismaMockUpdated);
        mockUserRepository.GetPerId.mockResolvedValue(userPrismaMock);

        const userMockUpdated = {
            name: userPrismaMockUpdated.name,
            email: userPrismaMockUpdated.email,
            password: "strongPassword!@",
            cpf: userPrismaMockUpdated.cpf,
        };

        const user = await userService.Update(
            userMockUpdated,
            userPrismaMock.id,
        );

        expect(user.updatedAt).not.toBeNull();
        expect(user).toEqual(userPrismaMockUpdated);
    });

    test("Should throw a BaseException when not find a user by ID", async () => {
        const userPrismaMock: userPrisma = {
            id: "b6bec75e-3878-42e6-98c6-8e2d60fe044b",
            active: true,
            cpf: "01234567890",
            createdAt: new Date(),
            name: "Jane Doe",
            email: "jane@email.com",
            updatedAt: null,
        };

        const userPrismaMockUpdated = {
            ...userPrismaMock,
            password: "strongPassword",
        };

        userPrismaMockUpdated.email = "janedoe@email.com";
        userPrismaMockUpdated.updatedAt = new Date();

        await expect(
            userService.Update(userPrismaMockUpdated, "some-id"),
        ).rejects.toThrow(
            new BaseException(USER_NOT_FOUND_MESSAGE, HttpStatusCode.NOT_FOUND),
        );
    });
});

describe("Tests involved the delete method", () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockAuthRepository: jest.Mocked<IAuthRepository>;
    let userService: UserService;

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

        userService = new UserService(mockUserRepository, mockAuthRepository);
    });

    test("Should not return a throw when delete user", async () => {
        const userPrismaMock: userPrisma = {
            id: "b6bec75e-3878-42e6-98c6-8e2d60fe044b",
            active: true,
            cpf: "01234567890",
            createdAt: new Date(),
            name: "Jane Doe",
            email: "jane@email.com",
            updatedAt: null,
        };

        mockUserRepository.Delete.mockResolvedValue();
        mockUserRepository.GetPerId.mockResolvedValue(userPrismaMock);

        await expect(
            userService.Delete("b6bec75e-3878-42e6-98c6-8e2d60fe044b"),
        ).resolves.not.toThrow();
    });

    test("Should throw a BaseException", async () => {
        mockUserRepository.GetPerId.mockResolvedValue(null);

        await expect(userService.Delete("some-id")).rejects.toThrow(
            new BaseException(USER_NOT_FOUND_MESSAGE, HttpStatusCode.NOT_FOUND),
        );
    });
});
