import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import IBankRepository from "../../repositories/bank/interfaces/IBankRepository";
import BankService from "../../services/bank/BankService";

type bankPrisma = {
    id: string;
    name: string;
    compe: number | null;
    ispb: string | null;
    userId: string;
};

describe("Tests involved the GetAll method", () => {
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankService: BankService;

    beforeEach(() => {
        mockBankRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankService = new BankService(mockBankRepository);
    });

    test("Should get a list of banks", async () => {
        const banksMockPrisma: bankPrisma[] = [
            {
                id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
                name: "Some Bank 1",
                ispb: null,
                compe: null,
                userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
            },
            {
                id: "d4424950-da4b-4cf7-9e1d-f63953f32a38",
                name: "Some Bank 2",
                ispb: null,
                compe: null,
                userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
            },
        ];

        mockBankRepository.GetAll.mockResolvedValue(banksMockPrisma);

        const banks = await bankService.GetAll(
            "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        );

        expect(banks).toBe(banksMockPrisma);
        expect(banks.length).toBeGreaterThanOrEqual(2);
        expect(mockBankRepository.GetAll).toHaveBeenCalledWith(
            "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        );
    });

    test("Should get a empty list of banks", async () => {
        mockBankRepository.GetAll.mockResolvedValue([]);

        const banks = await bankService.GetAll("some-user-id");

        expect(banks.length).toBe(0);
    });
});

describe("Tests involved the Create method", () => {
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankService: BankService;

    beforeEach(() => {
        mockBankRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankService = new BankService(mockBankRepository);
    });

    test("Should create a new bank in user account", async () => {
        const bankMockPrisma: bankPrisma = {
            id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
            name: "Some Bank 1",
            ispb: null,
            compe: null,
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        const bankDto = {
            name: "Some Bank 1",
            ispb: "1234566",
            compe: 123,
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        mockBankRepository.Create.mockResolvedValue(bankMockPrisma);

        const bank = await bankService.Create(bankDto);

        expect(bank).toBe(bankMockPrisma);
    });
});

describe("Tests involved the Update method", () => {
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankService: BankService;

    beforeEach(() => {
        mockBankRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankService = new BankService(mockBankRepository);
    });

    test("Should update the bank name in database", async () => {
        const bankMockPrisma: bankPrisma = {
            id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
            name: "Some Bank 1",
            ispb: null,
            compe: null,
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        mockBankRepository.GetPerId.mockResolvedValue(bankMockPrisma);

        const bankMockPrismaUpdated: bankPrisma = {
            ...bankMockPrisma,
            name: "Another bank 1",
            ispb: "1234566",
            compe: 123,
        };

        mockBankRepository.Update.mockResolvedValue(bankMockPrismaUpdated);

        const bankDto = {
            name: "Another bank 1",
            ispb: "1234566",
            compe: 123,
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        const bank = await bankService.Update(
            bankDto,
            "79f407f6-c1ba-4633-88a1-83352cb73bc4",
        );

        expect(bank).toBe(bankMockPrismaUpdated);
        expect(mockBankRepository.GetPerId).toHaveBeenCalledWith(
            "79f407f6-c1ba-4633-88a1-83352cb73bc4",
        );
    });

    test("Should get a throw BaseException when bank is not found", async () => {
        mockBankRepository.GetPerId.mockResolvedValue(null);

        const bankDto = {
            name: "Another bank 1",
            ispb: "1234566",
            compe: 123,
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        await expect(bankService.Update(bankDto, "wrong-id")).rejects.toThrow(
            new BaseException("Bank not found", HttpStatusCode.NOT_FOUND),
        );
    });
});

describe("Tests involved the Delete method", () => {
    let mockBankRepository: jest.Mocked<IBankRepository>;
    let bankService: BankService;

    beforeEach(() => {
        mockBankRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        bankService = new BankService(mockBankRepository);
    });

    test("Should not return a throw when delete a bank", async () => {
        const bankMockPrisma: bankPrisma = {
            id: "79f407f6-c1ba-4633-88a1-83352cb73bc4",
            name: "Some Bank 1",
            ispb: null,
            compe: null,
            userId: "9f2aa01e-4abb-4223-8f93-2387d8bdc663",
        };

        mockBankRepository.GetPerId.mockResolvedValue(bankMockPrisma);

        mockBankRepository.Delete.mockResolvedValue();

        await expect(
            bankService.Delete("79f407f6-c1ba-4633-88a1-83352cb73bc4"),
        ).resolves.not.toThrow();
        expect(mockBankRepository.Delete).toHaveBeenCalledWith(
            "79f407f6-c1ba-4633-88a1-83352cb73bc4",
        );
    });

    test("Should throw a BaseException when bank is not found", async () => {
        mockBankRepository.GetPerId.mockResolvedValue(null);

        await expect(bankService.Delete("some-id")).rejects.toThrow(
            new BaseException("Bank not found", HttpStatusCode.NOT_FOUND),
        );
    });
});
