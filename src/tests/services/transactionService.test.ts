/* eslint-disable @typescript-eslint/no-explicit-any */
import { BankAccount, Transaction, TransactionType } from "@prisma/client";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";

import ITransactionRepository from "../../repositories/transaction/interfaces/ITransactionRepository";
import IBankAccountService from "../../services/bankAccount/interfaces/IBankAccountService";
import TransactionService from "../../services/transaction/TransactionService";

import BaseException from "../../models/bases/BaseException";
import TransactionDto from "../../models/transaction/TransactioDto";

import { prismaMock } from "../setup/setupPrisma";
import IExpenseService from "../../services/expense/interfaces/IExpenseService";

describe("Tests involved the GetAll method", () => {
    let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
    let mockBankAccountService: jest.Mocked<IBankAccountService>;
    let mockExpenseService: jest.Mocked<IExpenseService>;

    let transactionService: TransactionService;

    beforeEach(() => {
        mockTransactionRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankAccountService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockExpenseService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdatePaidProperty: jest.fn(),
            Delete: jest.fn(),
        };

        transactionService = new TransactionService(
            mockTransactionRepository,
            mockBankAccountService,
            mockExpenseService,
        );
    });

    test("Should get a list of transactions", async () => {
        const transactionMockPrisma: Transaction[] = [
            {
                id: "some-transaction-id-1",
                value: 50,
                type: "Entry",
                date: new Date(Date.now()),
                description: "Some description",
                userId: "some-user-id",
                bankAccountId: "some-bank-account-id",
                expenseId: null,
                createdAt: new Date(Date.now()),
                updatedAt: null,
            },
            {
                id: "some-transaction-id-2",
                value: 50,
                type: "Exit",
                date: new Date(Date.now()),
                description: "Some description",
                userId: "some-user-id",
                bankAccountId: "some-bank-account-id",
                expenseId: null,
                createdAt: new Date(Date.now()),
                updatedAt: null,
            },
        ];

        mockTransactionRepository.GetAll.mockResolvedValue(
            transactionMockPrisma,
        );

        const transactions = await transactionService.GetAll("some-user-id");

        expect(transactions).toBe(transactionMockPrisma);
        expect(transactions.length).toBeGreaterThanOrEqual(2);
        expect(mockTransactionRepository.GetAll).toHaveBeenCalledWith(
            "some-user-id",
        );
    });

    test("Should get a empty list of transaction", async () => {
        mockTransactionRepository.GetAll.mockResolvedValue([]);

        const transactions = await transactionService.GetAll("some-user-id");

        expect(transactions.length).toBe(0);
        expect(mockTransactionRepository.GetAll).toHaveBeenCalledWith(
            "some-user-id",
        );
    });
});

describe("Tests involved the GetPerId method", () => {
    let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
    let mockBankAccountService: jest.Mocked<IBankAccountService>;
    let mockExpenseService: jest.Mocked<IExpenseService>;

    let transactionService: TransactionService;

    beforeEach(() => {
        mockTransactionRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankAccountService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockExpenseService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdatePaidProperty: jest.fn(),
            Delete: jest.fn(),
        };

        transactionService = new TransactionService(
            mockTransactionRepository,
            mockBankAccountService,
            mockExpenseService,
        );
    });

    test("Should get a transaction per your id", async () => {
        const transactionMockPrisma: Transaction = {
            id: "some-transaction-id-1",
            value: 50,
            type: "Entry",
            date: new Date(Date.now()),
            description: "Some description",
            userId: "some-user-id",
            bankAccountId: "some-bank-account-id",
            expenseId: null,
            createdAt: new Date(Date.now()),
            updatedAt: null,
        };

        mockTransactionRepository.GetPerId.mockResolvedValue(
            transactionMockPrisma,
        );

        const transaction = await transactionService.GetPerId(
            "some-transaction-id-1",
            "some-user-id",
        );

        expect(transaction).toBe(transactionMockPrisma);
        expect(mockTransactionRepository.GetPerId).toHaveBeenCalledWith(
            "some-user-id",
            "some-transaction-id-1",
        );
    });

    test("Should get a throw BaseException when transaction is not founded", async () => {
        mockTransactionRepository.GetPerId.mockResolvedValue(null);

        await expect(
            transactionService.GetPerId(
                "some-transaction-id-1",
                "some-user-id",
            ),
        ).rejects.toThrow(
            new BaseException(
                "Transaction not found",
                HttpStatusCode.NOT_FOUND,
            ),
        );
    });
});

describe("Tests involved the Create method", () => {
    const transactionResult: Transaction = {
        id: "some-transaction-id",
        type: "Entry",
        description: "Some description",
        value: 50,
        bankAccountId: "some-bank-account-id",
        date: new Date(Date.now()),
        createdAt: new Date(Date.now()),
        updatedAt: null,
        expenseId: null,
        userId: "some-user-id",
    };

    let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
    let mockBankAccountService: jest.Mocked<IBankAccountService>;
    let mockExpenseService: jest.Mocked<IExpenseService>;

    let transactionService: TransactionService;

    beforeEach(() => {
        mockTransactionRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankAccountService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockExpenseService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdatePaidProperty: jest.fn(),
            Delete: jest.fn(),
        };

        transactionService = new TransactionService(
            mockTransactionRepository,
            mockBankAccountService,
            mockExpenseService,
        );
    });

    test.each([
        [
            TransactionType.Entry,
            {
                ...transactionResult,
                type: TransactionType.Entry,
            },
            {
                id: "some-bank-account-id",
                accountNumber: "123456789",
                agency: "0001",
                balance: 0,
                active: true,
                bankId: "some-bank-id",
                userId: "some-user-id",
                createdAt: new Date("2023-10-01T00:00:00Z"),
                updatedAt: null,
            },
            50,
        ],
        [
            TransactionType.Exit,
            {
                ...transactionResult,
                type: TransactionType.Exit,
            },
            {
                id: "some-bank-account-id",
                accountNumber: "123456789",
                agency: "0001",
                balance: 50,
                active: true,
                bankId: "some-bank-id",
                userId: "some-user-id",
                createdAt: new Date("2023-10-01T00:00:00Z"),
                updatedAt: null,
            },
            0,
        ],
    ])(
        "Should create a new transaction with type %s",
        async (
            type,
            expectedTransaction,
            expectedBankAccount,
            balanceExpected,
        ) => {
            mockTransactionRepository.Create.mockResolvedValue(
                expectedTransaction,
            );

            mockBankAccountService.GetPerId.mockResolvedValue(
                expectedBankAccount,
            );

            mockBankAccountService.UpdateBalance.mockResolvedValue({
                id: "some-bank-account-id",
                accountNumber: "123456789",
                agency: "0001",
                balance: balanceExpected,
                active: true,
                bankId: "some-bank-id",
                userId: "some-user-id",
                createdAt: new Date("2023-10-01T00:00:00Z"),
                updatedAt: null,
            });

            const data: TransactionDto = {
                type: type,
                description: "Some description",
                value: balanceExpected,
                bankAccountId: "some-bank-account-id",
                date: new Date(Date.now()),
                userId: "some-user-id",
                expenseId: "some-expense-id",
            };

            const transaction = await transactionService.Create(data);

            expect(transaction).toBe(expectedTransaction);
        },
    );

    test("Should get a new BaseException throw when the transaction value is greater than account balance", async () => {
        mockBankAccountService.GetPerId.mockResolvedValue({
            id: "some-bank-account-id",
            accountNumber: "123456789",
            agency: "0001",
            balance: 50,
            active: true,
            bankId: "some-bank-id",
            userId: "some-user-id",
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: null,
        });

        const data: TransactionDto = {
            type: TransactionType.Exit,
            description: "Some description",
            value: 75,
            bankAccountId: "some-bank-account-id",
            date: new Date(Date.now()),
            userId: "some-user-id",
            expenseId: "some-expense-id",
        };

        await expect(transactionService.Create(data)).rejects.toThrow(
            new BaseException(
                "The transaction value is greater than your account balance",
                HttpStatusCode.BAD_REQUEST,
            ),
        );
    });

    test("Should get a throw exception in transaction", async () => {
        prismaMock.$transaction.mockImplementationOnce(async () => {
            throw new Error("Random error");
        });

        mockBankAccountService.GetPerId.mockResolvedValue({
            id: "some-bank-account-id",
            accountNumber: "123456789",
            agency: "0001",
            balance: 50,
            active: true,
            bankId: "some-bank-id",
            userId: "some-user-id",
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: null,
        });

        const data: TransactionDto = {
            type: TransactionType.Exit,
            description: "Some description",
            value: 25,
            bankAccountId: "some-bank-account-id",
            date: new Date(Date.now()),
            userId: "some-user-id",
            expenseId: "some-expense-id",
        };

        await expect(transactionService.Create(data)).rejects.toThrow(
            new BaseException(
                "Random error",
                HttpStatusCode.INTERNAL_SERVER_ERROR,
            ),
        );
    });
});

describe("Tests involved the Update method", () => {
    const baseTransaction: Transaction = {
        id: "trans-1",
        value: 100,
        type: TransactionType.Entry,
        date: new Date("2024-01-01"),
        description: "desc",
        userId: "user-1",
        bankAccountId: "acc-1",
        expenseId: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: null,
    };

    const baseAccount: BankAccount = {
        id: "acc-1",
        accountNumber: "123",
        agency: "0001",
        balance: 100,
        active: true,
        bankId: "bank-1",
        userId: "user-1",
        createdAt: new Date("2024-01-01"),
        updatedAt: null,
    };

    let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
    let mockBankAccountService: jest.Mocked<IBankAccountService>;
    let mockExpenseService: jest.Mocked<IExpenseService>;

    let transactionService: TransactionService;

    beforeEach(() => {
        mockTransactionRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankAccountService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockExpenseService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdatePaidProperty: jest.fn(),
            Delete: jest.fn(),
        };

        transactionService = new TransactionService(
            mockTransactionRepository,
            mockBankAccountService,
            mockExpenseService,
        );

        jest.clearAllMocks();
    });

    test.each([
        // Atualiza apenas o valor (Entry, valor aumenta)
        {
            desc: "should update only value (Entry, value increases)",
            oldTransaction: {
                ...baseTransaction,
                value: 100,
                type: TransactionType.Entry,
            },
            updateDto: { value: 150 },
            updatedTransaction: { ...baseTransaction, value: 150 },
            account: { ...baseAccount, balance: 100 },
            expectedBalance: 150,
            field: "value",
        },
        // Atualiza apenas o valor (Entry, valor diminui)
        {
            desc: "should update only value (Entry, value decreases)",
            oldTransaction: {
                ...baseTransaction,
                value: 150,
                type: TransactionType.Entry,
            },
            updateDto: { value: 100 },
            updatedTransaction: { ...baseTransaction, value: 100 },
            account: { ...baseAccount, balance: 150 },
            expectedBalance: 100,
            field: "value",
        },
        // Atualiza apenas o valor (Exit, valor aumenta)
        {
            desc: "should update only value (Exit, value increases)",
            oldTransaction: {
                ...baseTransaction,
                value: 50,
                type: TransactionType.Exit,
            },
            updateDto: { value: 80 },
            updatedTransaction: {
                ...baseTransaction,
                value: 80,
                type: TransactionType.Exit,
            },
            account: { ...baseAccount, balance: 100 },
            expectedBalance: 70,
            field: "value",
        },
        // Atualiza apenas o valor (Exit, valor diminui)
        {
            desc: "should update only value (Exit, value decreases)",
            oldTransaction: {
                ...baseTransaction,
                value: 80,
                type: TransactionType.Exit,
            },
            updateDto: { value: 50 },
            updatedTransaction: {
                ...baseTransaction,
                value: 50,
                type: TransactionType.Exit,
            },
            account: { ...baseAccount, balance: 70 },
            expectedBalance: 100,
            field: "value",
        },
        // Atualiza apenas a data
        {
            desc: "should update only date",
            oldTransaction: { ...baseTransaction },
            updateDto: { date: new Date("2024-02-01") },
            updatedTransaction: {
                ...baseTransaction,
                date: new Date("2024-02-01"),
            },
            account: { ...baseAccount },
            expectedBalance: 100,
            field: "date",
        },
        // Atualiza apenas o bankAccountId
        {
            desc: "should update only bankAccountId",
            oldTransaction: { ...baseTransaction, bankAccountId: "acc-1" },
            updateDto: { bankAccountId: "acc-2" },
            updatedTransaction: { ...baseTransaction, bankAccountId: "acc-2" },
            account: { ...baseAccount, id: "acc-2" },
            expectedBalance: 100,
            field: "bankAccountId",
        },
        // Atualiza apenas o expenseId
        {
            desc: "should update only expenseId",
            oldTransaction: { ...baseTransaction, expenseId: null },
            updateDto: { expenseId: "exp-1" },
            updatedTransaction: { ...baseTransaction, expenseId: "exp-1" },
            account: { ...baseAccount },
            expectedBalance: 100,
            field: "expenseId",
        },
    ])(
        "$desc",
        async ({
            oldTransaction,
            updateDto,
            updatedTransaction,
            account,
            expectedBalance,
            field,
        }) => {
            mockTransactionRepository.GetPerId.mockResolvedValue(
                oldTransaction,
            );
            mockTransactionRepository.Update.mockResolvedValue(
                updatedTransaction,
            );

            // Para casos de valor ou bankAccountId, simula busca e update de saldo
            if (field === "value" || field === "bankAccountId") {
                mockBankAccountService.GetPerId.mockResolvedValue(account);
                mockBankAccountService.UpdateBalance.mockResolvedValue({
                    ...account,
                    balance: expectedBalance,
                });
            }

            // Para bankAccountId, simula busca de contas antiga e nova
            if (field === "bankAccountId") {
                mockBankAccountService.GetPerId.mockResolvedValueOnce({
                    ...baseAccount,
                    id: oldTransaction.bankAccountId,
                }) // old
                    .mockResolvedValueOnce(account); // new
                mockBankAccountService.UpdateBalance.mockResolvedValueOnce({
                    ...baseAccount,
                    id: oldTransaction.bankAccountId,
                    balance: 0,
                }) // restore old
                    .mockResolvedValueOnce({
                        ...account,
                        balance: expectedBalance,
                    }); // apply new
            }

            const result = await transactionService.Update(
                oldTransaction.id,
                oldTransaction.userId,
                updateDto as any,
            );

            expect(result).toEqual(updatedTransaction);
            expect(mockTransactionRepository.Update).toHaveBeenCalled();
        },
    );

    test("should throw BaseException if error occurs in transaction", async () => {
        mockTransactionRepository.GetPerId.mockResolvedValue(baseTransaction);
        mockTransactionRepository.Update.mockImplementation(() => {
            throw new Error("Random error");
        });

        await expect(
            transactionService.Update(
                baseTransaction.id,
                baseTransaction.userId,
                {
                    value: 200,
                    date: new Date(),
                    bankAccountId: "",
                    description: "",
                },
            ),
        ).rejects.toThrow(
            new BaseException(
                "An error occurred when updating the transaction",
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                new Error("Random error"),
            ),
        );
    });
});

describe("Tests involved the Delete method", () => {
    const transactionResult: Transaction = {
        id: "some-transaction-id",
        type: "Entry",
        description: "Some description",
        value: 50,
        bankAccountId: "some-bank-account-id",
        date: new Date(Date.now()),
        createdAt: new Date(Date.now()),
        updatedAt: null,
        expenseId: null,
        userId: "some-user-id",
    };

    let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
    let mockBankAccountService: jest.Mocked<IBankAccountService>;
    let mockExpenseService: jest.Mocked<IExpenseService>;

    let transactionService: TransactionService;

    beforeEach(() => {
        mockTransactionRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };

        mockBankAccountService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdateBalance: jest.fn(),
            Delete: jest.fn(),
        };

        mockExpenseService = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdatePaidProperty: jest.fn(),
            Delete: jest.fn(),
        };

        transactionService = new TransactionService(
            mockTransactionRepository,
            mockBankAccountService,
            mockExpenseService,
        );
    });

    test.each([
        {
            ...transactionResult,
            type: TransactionType.Entry,
        },
        {
            ...transactionResult,
            type: TransactionType.Exit,
        },
    ])(
        "Should not throw a BaseException when delete a transaction",
        async (expectedTransaction) => {
            mockBankAccountService.GetPerId.mockResolvedValue({
                id: "some-bank-account-id",
                accountNumber: "123456789",
                agency: "0001",
                balance: 50,
                active: true,
                bankId: "some-bank-id",
                userId: "some-user-id",
                createdAt: new Date("2023-10-01T00:00:00Z"),
                updatedAt: null,
            });

            mockBankAccountService.UpdateBalance.mockResolvedValueOnce({
                id: "some-bank-account-id",
                accountNumber: "123456789",
                agency: "0001",
                balance: 50,
                active: true,
                bankId: "some-bank-id",
                userId: "some-user-id",
                createdAt: new Date("2023-10-01T00:00:00Z"),
                updatedAt: null,
            });

            mockTransactionRepository.GetPerId.mockResolvedValue(
                expectedTransaction,
            );

            await expect(
                transactionService.Delete(
                    "some-transaction-id",
                    "some-user-id",
                ),
            ).resolves.not.toThrow();
        },
    );

    test("Should get a new BaseException throw when the transaction value is greater than account balance", async () => {
        mockBankAccountService.GetPerId.mockResolvedValue({
            id: "some-bank-account-id",
            accountNumber: "123456789",
            agency: "0001",
            balance: 50,
            active: true,
            bankId: "some-bank-id",
            userId: "some-user-id",
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: null,
        });

        mockTransactionRepository.GetPerId.mockResolvedValue({
            ...transactionResult,
            value: 75,
        });

        await expect(
            transactionService.Delete("some-transaction-id", "some-user-id"),
        ).rejects.toThrow(
            new BaseException(
                "The transaction value is greater than your account balance",
                HttpStatusCode.BAD_REQUEST,
            ),
        );
    });

    test("Should get a throw exception in transaction", async () => {
        prismaMock.$transaction.mockImplementationOnce(async () => {
            throw new Error("Random error");
        });

        mockBankAccountService.GetPerId.mockResolvedValue({
            id: "some-bank-account-id",
            accountNumber: "123456789",
            agency: "0001",
            balance: 50,
            active: true,
            bankId: "some-bank-id",
            userId: "some-user-id",
            createdAt: new Date("2023-10-01T00:00:00Z"),
            updatedAt: null,
        });

        mockTransactionRepository.GetPerId.mockResolvedValue({
            ...transactionResult,
        });

        await expect(
            transactionService.Delete("some-transaction-id", "some-user-id"),
        ).rejects.toThrow(
            new BaseException(
                "Random error",
                HttpStatusCode.INTERNAL_SERVER_ERROR,
            ),
        );
    });
});
