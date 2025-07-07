import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import IBankRepository from "../../repositories/bank/interfaces/IBankRepository";
import IBankAccountRepository from "../../repositories/bankAccount/interfaces/IBankAccountRepository";
import BankAccountService from "../../services/bankAccount/BankAccountService";

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

describe("Tests involved the GetAll method", () => {
    let mockBankAccountRepository: jest.Mocked<IBankAccountRepository>;
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankAccountService: BankAccountService;

    beforeEach(() => {
        mockBankAccountRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankRepository = {
            GetPerId: jest.fn(),
            GetAll: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankAccountService = new BankAccountService(
            mockBankAccountRepository,
            mockBankRepository,
        );
    });

    test("Should return all bank accounts from database", async () => {
        const accountMockPrisma: bankAccountPrisma[] = [
            {
                id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
                accountNumber: "123456789",
                agency: "0001",
                balance: 1000,
                active: true,
                bankId: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
                userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
                createdAt: new Date("2023-10-01T00:00:00Z"),
                updatedAt: null,
            },
        ];

        mockBankAccountRepository.GetAll.mockResolvedValue(accountMockPrisma);

        const accounts = await bankAccountService.GetAll(
            "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        );

        expect(accounts).toBe(accountMockPrisma);
        expect(mockBankAccountRepository.GetAll).toHaveBeenCalledWith(
            "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        );
        expect(accounts.length).toBeGreaterThan(0);
    });

    test("Should return an empty array when no bank accounts are found", async () => {
        mockBankAccountRepository.GetAll.mockResolvedValue([]);

        const accounts = await bankAccountService.GetAll(
            "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        );

        expect(accounts).toEqual([]);
        expect(mockBankAccountRepository.GetAll).toHaveBeenCalledWith(
            "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        );
    });
});

describe("Tests involved the GetPerId method", () => {
    let mockBankAccountRepository: jest.Mocked<IBankAccountRepository>;
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankAccountService: BankAccountService;

    beforeEach(() => {
        mockBankAccountRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankRepository = {
            GetPerId: jest.fn(),
            GetAll: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankAccountService = new BankAccountService(
            mockBankAccountRepository,
            mockBankRepository,
        );
    });

    test("Should return a bank account by ID", async () => {
        const accountMockPrisma: bankAccountPrisma = {
            id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
            accountNumber: "123456789",
            agency: "0001",
            balance: 1000,
            active: true,
            bankId: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: null,
        };

        mockBankAccountRepository.GetPerId.mockResolvedValue(accountMockPrisma);

        const account = await bankAccountService.GetPerId(
            "79f407f6-c1ba-4633-88a1-83352cb73bc4",
        );

        expect(account).toBe(accountMockPrisma);
        expect(mockBankAccountRepository.GetPerId).toHaveBeenCalledWith(
            "79f407f6-c1ba-4633-88a1-83352cb73bc4",
        );
    });

    test("Should throw an error when the bank account is not found", async () => {
        mockBankAccountRepository.GetPerId.mockResolvedValue(null);

        await expect(
            bankAccountService.GetPerId("non-existent-id"),
        ).rejects.toThrow(
            new BaseException(
                "Bank account not found",
                HttpStatusCode.NOT_FOUND,
            ),
        );
        expect(mockBankAccountRepository.GetPerId).toHaveBeenCalledWith(
            "non-existent-id",
        );
    });
});

describe("Tests involved the Create method", () => {
    let mockBankAccountRepository: jest.Mocked<IBankAccountRepository>;
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankAccountService: BankAccountService;

    beforeEach(() => {
        mockBankAccountRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankRepository = {
            GetPerId: jest.fn(),
            GetAll: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankAccountService = new BankAccountService(
            mockBankAccountRepository,
            mockBankRepository,
        );
    });

    test("Should create a new bank account", async () => {
        const newAccountData = {
            accountNumber: "123456789",
            agency: "0001",
            balance: 1000,
            active: true,
            bankId: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        const createdAccountMockPrisma = {
            ...newAccountData,
            id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: null,
        };

        mockBankAccountRepository.Create.mockResolvedValue(
            createdAccountMockPrisma,
        );
        mockBankRepository.GetPerId.mockResolvedValue({
            id: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
            name: "Test Bank",
            compe: null,
            ispb: null,
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        });

        const account = await bankAccountService.Create(newAccountData);

        expect(account).toEqual(createdAccountMockPrisma);
        expect(mockBankAccountRepository.Create).toHaveBeenCalledWith(
            newAccountData,
        );
    });

    test("Should throw an error if the bank does not exist", async () => {
        const newAccountData = {
            accountNumber: "123456789",
            agency: "0001",
            balance: 1000,
            active: true,
            bankId: "non-existent-bank-id",
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        mockBankRepository.GetPerId.mockResolvedValue(null);

        await expect(bankAccountService.Create(newAccountData)).rejects.toThrow(
            new BaseException(
                "Bank not found, please verify if is registered in user account",
                HttpStatusCode.BAD_REQUEST,
            ),
        );
    });
});

describe("Tests involved the Update method", () => {
    let mockBankAccountRepository: jest.Mocked<IBankAccountRepository>;
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankAccountService: BankAccountService;

    beforeEach(() => {
        mockBankAccountRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankRepository = {
            GetPerId: jest.fn(),
            GetAll: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankAccountService = new BankAccountService(
            mockBankAccountRepository,
            mockBankRepository,
        );
    });

    test("Should update an existing bank account", async () => {
        const updatedAccountData = {
            id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
            accountNumber: "987654321",
            agency: "002",
            balance: 2000,
            active: true,
            bankId: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        const updatedAccountMockPrisma = {
            ...updatedAccountData,
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: new Date("2023-10-02T00:00:00Z"),
        };

        mockBankAccountRepository.Update.mockResolvedValue(
            updatedAccountMockPrisma,
        );
        mockBankAccountRepository.GetPerId.mockResolvedValue(
            updatedAccountMockPrisma,
        );

        mockBankRepository.GetPerId.mockResolvedValue({
            id: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
            name: "Test Bank",
            compe: null,
            ispb: null,
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        });

        const account = await bankAccountService.Update(
            "79f407f6-c1ba-4633-88a1-83352cb73bc4",
            updatedAccountData,
        );

        expect(account).toEqual(updatedAccountMockPrisma);
    });

    test("Should throw an error if the bank account does not exist", async () => {
        const updatedAccountData = {
            id: "non-existent-id",
            accountNumber: "987654321",
            agency: "002",
            balance: 2000,
            active: true,
            bankId: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        mockBankAccountRepository.GetPerId.mockResolvedValue(null);

        await expect(
            bankAccountService.Update("non-existent-id", updatedAccountData),
        ).rejects.toThrow(
            new BaseException(
                "Bank account not found",
                HttpStatusCode.NOT_FOUND,
            ),
        );
    });

    test("Should throw an error if the bank does not exist during update", async () => {
        const updatedAccountData = {
            id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
            accountNumber: "987654321",
            agency: "002",
            balance: 2000,
            active: true,
            bankId: "non-existent-bank-id",
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        const accountMockPrisma: bankAccountPrisma = {
            id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
            accountNumber: "123456789",
            agency: "002",
            balance: 2000,
            active: true,
            bankId: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: null,
        };

        mockBankAccountRepository.GetPerId.mockResolvedValue(accountMockPrisma);
        mockBankRepository.GetPerId.mockResolvedValue(null);

        await expect(
            bankAccountService.Update(
                "79f407f6-c1ba-4633-88a1-83352cb73bc4",
                updatedAccountData,
            ),
        ).rejects.toThrow(
            new BaseException(
                "Bank not found, please verify if is registered in user account",
                HttpStatusCode.BAD_REQUEST,
            ),
        );
    });
});

describe("Tests involved the UpdateBalance method", () => {
    let mockBankAccountRepository: jest.Mocked<IBankAccountRepository>;
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankAccountService: BankAccountService;

    beforeEach(() => {
        mockBankAccountRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankRepository = {
            GetPerId: jest.fn(),
            GetAll: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankAccountService = new BankAccountService(
            mockBankAccountRepository,
            mockBankRepository,
        );
    });

    test("Should update the balance of an existing bank account", async () => {
        const accountId = "79f407f6-c1ba-4633-88a1-83352cb73bc4";
        const newBalance = 1500;

        const updatedBalanceMockPrisma = {
            id: accountId,
            accountNumber: "123456789",
            agency: "0001",
            balance: newBalance,
            active: true,
            bankId: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: new Date("2023-10-02T00:00:00Z"),
        };

        mockBankAccountRepository.UpdateBalance.mockResolvedValue(
            updatedBalanceMockPrisma,
        );
        mockBankAccountRepository.GetPerId.mockResolvedValue(
            updatedBalanceMockPrisma,
        );

        const account = await bankAccountService.UpdateBalance(
            accountId,
            newBalance,
        );

        expect(account).toEqual(updatedBalanceMockPrisma);
        expect(mockBankAccountRepository.UpdateBalance).toHaveBeenCalledWith(
            accountId,
            newBalance,
        );
    });

    test("Should throw an error if the bank account does not exist when updating balance", async () => {
        const accountId = "non-existent-id";
        const newBalance = 1500;

        mockBankAccountRepository.GetPerId.mockResolvedValue(null);

        await expect(
            bankAccountService.UpdateBalance(accountId, newBalance),
        ).rejects.toThrow(
            new BaseException(
                "Bank account not found",
                HttpStatusCode.NOT_FOUND,
            ),
        );
    });
});

describe("Tests involved the Delete method", () => {
    let mockBankAccountRepository: jest.Mocked<IBankAccountRepository>;
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankAccountService: BankAccountService;

    beforeEach(() => {
        mockBankAccountRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankRepository = {
            GetPerId: jest.fn(),
            GetAll: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankAccountService = new BankAccountService(
            mockBankAccountRepository,
            mockBankRepository,
        );
    });

    test("Should delete an existing bank account", async () => {
        const accountId = "79f407f6-c1ba-4633-88a1-83352cb73bc4";

        mockBankAccountRepository.Delete.mockResolvedValue();
        mockBankAccountRepository.GetPerId.mockResolvedValue({
            id: accountId,
            accountNumber: "123456789",
            agency: "0001",
            balance: 1000,
            active: true,
            bankId: "d1f2e3c4-b5a6-7b8c-9d0e-f1a2b3c4d5e6",
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: null,
        });

        await expect(
            bankAccountService.Delete(accountId),
        ).resolves.not.toThrow();

        expect(mockBankAccountRepository.Delete).toHaveBeenCalledWith(
            accountId,
        );
    });

    test("Should throw an error if the bank account does not exist when deleting", async () => {
        const accountId = "non-existent-id";

        mockBankAccountRepository.GetPerId.mockResolvedValue(null);

        await expect(bankAccountService.Delete(accountId)).rejects.toThrow(
            new BaseException(
                "Bank account not found",
                HttpStatusCode.NOT_FOUND,
            ),
        );
    });
});
