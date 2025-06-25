import BaseException from "../../../models/bases/BaseException";
import { HttpStatusCode } from "../../../models/enums/HttpStatusCode";
import BankAccountRepository from "../../../repositories/bankAccount/BankAccountRepository";
import { prismaMock } from "../../setup/setupPrisma";
import BankAccountDto from "../../../models/bankAccount/BankAccountDto";

// Type baseado no schema.prisma
type bankAccountPrisma = {
    id: string;
    accountNumber: string;
    agency: number;
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
        agency: 1234,
        balance: 1000.5,
        active: true,
        bankId: "bank-123",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    test("should create new bank account", async () => {
        prismaMock.bankAccount.create.mockResolvedValue(bankAccountPrismaMock);

        const bankAccountDto = new BankAccountDto(
            bankAccountPrismaMock.accountNumber,
            bankAccountPrismaMock.agency,
            bankAccountPrismaMock.balance,
            bankAccountPrismaMock.bankId,
        );

        const bankAccountCreated = await bankAccountRepository.Create(
            bankAccountPrismaMock.userId,
            bankAccountDto,
        );

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
            bankAccountPrismaMock.userId,
            bankAccountPrismaMock.id,
        );

        expect(account).toEqual(bankAccountPrismaMock);
    });

    test("should update a bank account", async () => {
        const bankAccountPrismaMockUpdated = {
            ...bankAccountPrismaMock,
            balance: 2000,
            updatedAt: new Date(),
        };

        prismaMock.bankAccount.update.mockResolvedValue(
            bankAccountPrismaMockUpdated,
        );

        const bankAccountDtoUpdated = new BankAccountDto(
            bankAccountPrismaMockUpdated.accountNumber,
            bankAccountPrismaMockUpdated.agency,
            bankAccountPrismaMockUpdated.balance,
            bankAccountPrismaMockUpdated.bankId,
        );

        const account = await bankAccountRepository.Update(
            bankAccountPrismaMock.id,
            bankAccountPrismaMock.userId,
            bankAccountDtoUpdated,
        );

        expect(account).toEqual(bankAccountPrismaMockUpdated);
        expect(account.updatedAt).not.toBeNull();
    });

    test("should delete a bank account", async () => {
        prismaMock.bankAccount.update.mockResolvedValue({
            ...bankAccountPrismaMock,
            active: false,
            updatedAt: new Date(),
        });

        await expect(
            bankAccountRepository.Delete(bankAccountPrismaMock.id),
        ).resolves.not.toThrow();
    });
});

describe("Throw BankAccountRepository methods", () => {
    const bankAccountRepository = new BankAccountRepository();
    const BANK_ACCOUNT_NOT_FOUND_MESSAGE = "Bank Account not founded";

    test("should throw a BaseException when bank account not found", async () => {
        prismaMock.bankAccount.findUnique.mockResolvedValue(null);

        await expect(
            bankAccountRepository.GetPerId("user-123", "bankacc-123"),
        ).rejects.toEqual(
            new BaseException(
                BANK_ACCOUNT_NOT_FOUND_MESSAGE,
                HttpStatusCode.NOT_FOUND,
            ),
        );
    });
});
