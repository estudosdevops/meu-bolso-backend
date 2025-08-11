import BankAccountRepository from "../../../repositories/bankAccount/BankAccountRepository";
import { prismaMock } from "../../setup/setupPrisma";

// Type baseado no schema.prisma
type bankAccountPrisma = {
    id: string;
    accountNumber: string;
    agency: string;
    balance: number;
    active: boolean;
    bankId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date | null;
};

describe("Success BankAccountRepository methods", () => {
    const bankAccountRepository = new BankAccountRepository();

    const bankAccountPrismaMock: bankAccountPrisma = {
        id: "bankacc-123",
        accountNumber: "123456-7",
        agency: "1234",
        balance: 1000.5,
        active: true,
        bankId: "bank-123",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    test("should create new bank account", async () => {
        prismaMock.bankAccount.create.mockResolvedValue(bankAccountPrismaMock);

        const bankAccountDto = {
            accountNumber: "123456-7",
            agency: "1234",
            userId: "user-123",
            bankId: "bank-123",
            balance: 1000.5,
        };

        const bankAccountCreated =
            await bankAccountRepository.Create(bankAccountDto);

        expect(bankAccountCreated).toEqual(bankAccountPrismaMock);
    });

    test("should get all bank accounts by userId", async () => {
        prismaMock.bankAccount.findMany.mockResolvedValue([
            bankAccountPrismaMock,
        ]);

        const accounts = await bankAccountRepository.GetAll(
            bankAccountPrismaMock.userId,
        );

        expect(accounts).toEqual([bankAccountPrismaMock]);
    });

    test("should get a bank account by id and userId", async () => {
        prismaMock.bankAccount.findUnique.mockResolvedValue(
            bankAccountPrismaMock,
        );

        const account = await bankAccountRepository.GetPerId(
            bankAccountPrismaMock.id,
        );

        expect(account).toEqual(bankAccountPrismaMock);
    });

    test("should update a bank account", async () => {
        const bankAccountPrismaMockUpdated = {
            ...bankAccountPrismaMock,
            balance: 2000,
            updatedAt: new Date(Date.now()),
        };

        prismaMock.bankAccount.update.mockResolvedValue(
            bankAccountPrismaMockUpdated,
        );

        const bankAccountDtoUpdated = {
            accountNumber: "123456-7",
            agency: "1234",
            userId: "user-123",
            bankId: "bank-123",
            balance: 2000,
        };

        const account = await bankAccountRepository.Update(
            bankAccountPrismaMock.id,
            bankAccountPrismaMock.userId,
            bankAccountDtoUpdated,
        );

        expect(account).toEqual(bankAccountPrismaMockUpdated);
        expect(account.updatedAt).not.toBeNull();
    });

    test("Should update a balance from a bank account", async () => {
        const bankAccountPrismaMockUpdated = {
            ...bankAccountPrismaMock,
            balance: 3000,
            updatedAt: new Date(Date.now()),
        };

        prismaMock.bankAccount.update.mockResolvedValue(
            bankAccountPrismaMockUpdated,
        );

        const account = await bankAccountRepository.UpdateBalance(
            "bankacc-123",
            3000,
        );

        expect(account.balance).toEqual(3000);
    });

    test("should delete a bank account", async () => {
        prismaMock.bankAccount.update.mockResolvedValue({
            ...bankAccountPrismaMock,
            active: false,
            updatedAt: new Date(Date.now()),
        });

        await expect(
            bankAccountRepository.Delete(bankAccountPrismaMock.id),
        ).resolves.not.toThrow();
    });
});

describe("Throw BankAccountRepository methods", () => {
    const bankAccountRepository = new BankAccountRepository();

    test("should throw a BaseException when bank account not found", async () => {
        prismaMock.bankAccount.findUnique.mockResolvedValue(null);

        await expect(
            bankAccountRepository.GetPerId("bankacc-123"),
        ).resolves.toBeNull();
    });
});
