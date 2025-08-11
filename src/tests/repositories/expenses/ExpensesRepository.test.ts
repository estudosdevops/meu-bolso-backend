import { ExpenseType } from "@prisma/client";
import ExpensesDto from "../../../models/expenses/ExpensesDto";
import ExpensesRepository from "../../../repositories/expenses/ExpensesRepository";
import { prismaMock } from "../../setup/setupPrisma";

type expensePrisma = {
    id: string;
    userId: string;
    name: string;
    paid: boolean;
    value: number;
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
        paid: false,
        value: 100.5,
        type: ExpenseType.Fixed,
        categoryId: "cat-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    test("should create new expense", async () => {
        prismaMock.expense.create.mockResolvedValue(expensePrismaMock);

        const expenseMock: ExpensesDto = {
            name: expensePrismaMock.name,
            paid: expensePrismaMock.paid,
            value: expensePrismaMock.value,
            type: expensePrismaMock.type,
            categoryId: expensePrismaMock.categoryId,
        };

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

        const expenseDtoUpdated: ExpensesDto = {
            name: expensePrismaMockUpdated.name,
            type: expensePrismaMockUpdated.type,
            categoryId: expensePrismaMockUpdated.categoryId,
            paid: expensePrismaMockUpdated.paid,
            value: expensePrismaMockUpdated.value,
        };

        const expense = await expensesRepository.Update(
            expenseDtoUpdated,
            expensePrismaMock.userId,
            expensePrismaMock.id,
        );

        expect(expense).toEqual(expensePrismaMockUpdated);
        expect(expense.updatedAt).not.toBeNull();
    });

    test("should update the paid property of an expense", async () => {
        const updatedExpense = {
            ...expensePrismaMock,
            paid: true,
        };

        prismaMock.expense.update.mockResolvedValue(updatedExpense);

        await expect(
            expensesRepository.UpdatePaidProperty(expensePrismaMock.id, true),
        ).resolves.not.toThrow();

        expect(prismaMock.expense.update).toHaveBeenCalledWith({
            where: { id: expensePrismaMock.id },
            data: { paid: true },
        });
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

    test("should throw a BaseException when expense not found", async () => {
        prismaMock.expense.findUnique.mockResolvedValue(null);

        await expect(
            expensesRepository.GetPerId("user-123", "exp-123"),
        ).resolves.toBeNull();
    });
});
