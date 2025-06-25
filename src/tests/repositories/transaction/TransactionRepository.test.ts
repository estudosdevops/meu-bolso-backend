import { TransactionType } from "@prisma/client";
import { TransactionRepository } from "../../../repositories/transaction/TransactionRepository";
import { prismaMock } from "../../setup/setupPrisma";
import TransactionDto from "../../../models/transaction/TransactioDto";

type transactionPrisma = {
    id: string;
    description: string | null;
    value: number;
    date: Date;
    type: "Entry" | "Exit";
    expenseId: string | null;
    bankAccountId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date | null;
};

describe("Success TransactionRepository methods", () => {
    const transactionRepository = new TransactionRepository();

    const transactionPrismaMock: transactionPrisma = {
        id: "trans-123",
        description: "Compra mercado",
        value: 150.75,
        date: new Date(),
        type: "Exit",
        expenseId: "exp-123",
        bankAccountId: "bankacc-123",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    test("should create new transaction", async () => {
        prismaMock.transaction.create.mockResolvedValue(transactionPrismaMock);

        const transactionMock = new TransactionDto(
            transactionPrismaMock.value,
            transactionPrismaMock.date,
            transactionPrismaMock.type as TransactionType,
            transactionPrismaMock.userId,
            transactionPrismaMock.bankAccountId,
            transactionPrismaMock.description ?? undefined,
            transactionPrismaMock.expenseId ?? undefined,
        );

        const transactionCreated =
            await transactionRepository.Create(transactionMock);

        expect(transactionCreated).toEqual(transactionPrismaMock);
    });

    test("should get all transactions by userId", async () => {
        prismaMock.transaction.findMany.mockResolvedValue([
            transactionPrismaMock,
        ]);

        const transactions = await transactionRepository.GetAll(
            transactionPrismaMock.userId,
        );

        expect(transactions).toEqual([transactionPrismaMock]);
    });

    test("should get a transaction by id and userId", async () => {
        prismaMock.transaction.findUnique.mockResolvedValue(
            transactionPrismaMock,
        );

        const transaction = await transactionRepository.GetPerId(
            transactionPrismaMock.userId,
            transactionPrismaMock.id,
        );

        expect(transaction).toEqual(transactionPrismaMock);
    });

    test("should update a transaction", async () => {
        const transactionPrismaMockUpdated = {
            ...transactionPrismaMock,
            value: 200,
            description: "Mercado atualizado",
            updatedAt: new Date(),
        };

        prismaMock.transaction.update.mockResolvedValue(
            transactionPrismaMockUpdated,
        );

        const transactionDtoUpdated = new TransactionDto(
            transactionPrismaMockUpdated.value,
            transactionPrismaMockUpdated.date,
            transactionPrismaMockUpdated.type as TransactionType,
            transactionPrismaMockUpdated.userId,
            transactionPrismaMockUpdated.bankAccountId,
            transactionPrismaMockUpdated.description ?? undefined,
            transactionPrismaMockUpdated.expenseId ?? undefined,
        );

        const transaction = await transactionRepository.Update(
            transactionPrismaMock.id,
            transactionPrismaMock.userId,
            transactionDtoUpdated,
        );

        expect(transaction).toEqual(transactionPrismaMockUpdated);
        expect(transaction.updatedAt).not.toBeNull();
    });

    test("should delete a transaction", async () => {
        prismaMock.transaction.delete.mockResolvedValue(transactionPrismaMock);

        await expect(
            transactionRepository.Delete(transactionPrismaMock.id),
        ).resolves.not.toThrow();
    });
});

describe("Throw TransactionRepository methods", () => {
    const transactionRepository = new TransactionRepository();

    test("should throw a BaseException when transaction not found", async () => {
        prismaMock.transaction.findUnique.mockResolvedValue(null);

        await expect(
            transactionRepository.GetPerId("user-123", "trans-123"),
        ).resolves.toBeNull();
    });
});
