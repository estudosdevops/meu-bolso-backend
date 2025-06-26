import UserRepository from "../../../repositories/user/userRepository";
import { prismaMock } from "../../setup/setupPrisma";

type userPrisma = {
    id: string;
    active: boolean;
    cpf: string;
    createdAt: Date;
    name: string;
    email: string;
    updatedAt: Date | null;
};

describe("Success UserRepository methods", () => {
    const userRepository = new UserRepository();

    const userPrismaMock: userPrisma = {
        id: "b6bec75e-3878-42e6-98c6-8e2d60fe044b",
        active: true,
        cpf: "01234567890",
        createdAt: new Date(),
        name: "Jane Doe",
        email: "jane@email.com",
        updatedAt: null,
    };

    test("should create new user ", async () => {
        prismaMock.user.create.mockResolvedValue(userPrismaMock);

        const userMock = {
            name: "Jane Doe",
            email: "jane@email.com",
            cpf: "01234567890",
        };

        const userCreated = await userRepository.Create(userMock);

        expect(userCreated).toEqual(userPrismaMock);
    });

    test("should get a user by your id ", async () => {
        prismaMock.user.findUnique.mockResolvedValue(userPrismaMock);

        const user = await userRepository.GetPerId(
            "6bec75e-3878-42e6-98c6-8e2d60fe044b",
        );

        expect(user).toEqual(userPrismaMock);
    });

    test("should get a user by your email ", async () => {
        prismaMock.user.findUnique.mockResolvedValue(userPrismaMock);

        const user = await userRepository.GetPerMail("jane@email.com");

        expect(user).toEqual(userPrismaMock);
    });

    test("should update a user informations ", async () => {
        const userPrismaMockUpdated = { ...userPrismaMock };

        userPrismaMockUpdated.email = "janedoe@email.com";
        userPrismaMockUpdated.updatedAt = new Date();

        prismaMock.user.update.mockResolvedValue(userPrismaMockUpdated);

        const userDtoUpdated = {
            name: userPrismaMockUpdated.name,
            email: userPrismaMockUpdated.email,
            cpf: userPrismaMockUpdated.cpf,
        };

        const user = await userRepository.Update(
            userDtoUpdated,
            "6bec75e-3878-42e6-98c6-8e2d60fe044b",
        );

        expect(user).toEqual(userPrismaMockUpdated);
        expect(user.updatedAt).not.toBeNull();
    });

    test("Should delete/deactivate user in database", async () => {
        const userPrismaDeleted = { ...userPrismaMock };

        userPrismaDeleted.active = false;

        prismaMock.user.update.mockResolvedValue(userPrismaDeleted);

        await expect(
            userRepository.Delete("6bec75e-3878-42e6-98c6-8e2d60fe044b"),
        ).resolves.not.toThrow();
    });
});

describe("Throw user repository methods", () => {
    const userRepository = new UserRepository();

    test("should throw a baseException when receive a null from DB", async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        await expect(
            userRepository.GetPerId("6bec75e-3878-42e6-98c6-8e2d60fe044b"),
        ).resolves.toBeNull();
    });

    test("should get a user by your email ", async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        await expect(
            userRepository.GetPerMail("wrong@email.com"),
        ).resolves.toBeNull();
    });
});
