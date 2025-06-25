import BaseException from "../../../models/bases/BaseException";
import { HttpStatusCode } from "../../../models/enums/HttpStatusCode";
import ExpensesDto from "../../../models/expenses/ExpensesDto";
import ExpensesRepository from "../../../repositories/expenses/ExpensesRepository";
import { prismaMock } from "../../setup/setupPrisma";

type expensePrisma = {
    id: string;
    userId: string;
    name: string;
    value: number | null;
    type: "Fixed" | "Variable";
    categoryId: string;
    createdAt: Date;
    updatedAt: Date | null;
};

describe("Success ExpensesRepository methods", () => {
    const expensesRepository = new ExpensesRepository();

    const expensePrismaMock: expensePrisma = {
        id: "exp-123",
        userId: "user-123",
        name: "Aluguel",
        value: 100.5,
        type: "Fixed",
        categoryId: "cat-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    test("should create new expense", async () => {
        prismaMock.expense.create.mockResolvedValue(expensePrismaMock);

        const expenseMock = new ExpensesDto(
            expensePrismaMock.name,
            expensePrismaMock.type,
            expensePrismaMock.categoryId,
        );

        const expenseCreated = await expensesRepository.Create(
            expenseMock,
            expensePrismaMock.userId,
        );

        expect(expenseCreated).toEqual(expensePrismaMock);
    });

    test("should get all expenses by userId", async () => {
        prismaMock.expense.findMany.mockResolvedValue([expensePrismaMock]);

        const expenses = await expensesRepository.GetAll(
            expensePrismaMock.userId,
        );

        expect(expenses).toEqual([expensePrismaMock]);
    });

    test("should get an expense by id and userId", async () => {
        prismaMock.expense.findUnique.mockResolvedValue(expensePrismaMock);

        const expense = await expensesRepository.GetPerId(
            expensePrismaMock.userId,
            expensePrismaMock.id,
        );

        expect(expense).toEqual(expensePrismaMock);
    });

    test("should update an expense", async () => {
        const expensePrismaMockUpdated = {
            ...expensePrismaMock,
            value: 200,
            updatedAt: new Date(),
        };

        prismaMock.expense.update.mockResolvedValue(expensePrismaMockUpdated);

        const expenseDtoUpdated = new ExpensesDto(
            expensePrismaMockUpdated.name,
            expensePrismaMockUpdated.type,
            expensePrismaMockUpdated.categoryId,
        );

        const expense = await expensesRepository.Update(
            expenseDtoUpdated,
            expensePrismaMock.userId,
            expensePrismaMock.id,
        );

        expect(expense).toEqual(expensePrismaMockUpdated);
        expect(expense.updatedAt).not.toBeNull();
    });

    test("should delete an expense", async () => {
        prismaMock.expense.delete.mockResolvedValue(expensePrismaMock);

        await expect(
            expensesRepository.Delete(expensePrismaMock.id),
        ).resolves.not.toThrow();
    });
});

describe("Throw ExpensesRepository methods", () => {
    const expensesRepository = new ExpensesRepository();
    const EXPENSE_NOT_FOUND_MESSAGE = "Expense not found";

    test("should throw a BaseException when expense not found", async () => {
        prismaMock.expense.findUnique.mockResolvedValue(null);

        await expect(
            expensesRepository.GetPerId("user-123", "exp-123"),
        ).rejects.toEqual(
            new BaseException(
                EXPENSE_NOT_FOUND_MESSAGE,
                HttpStatusCode.NOT_FOUND,
            ),
        );
    });
});
