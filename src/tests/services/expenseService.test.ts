import ExpenseService from "../../services/expense/ExpenseService";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import IExpensesRepository from "../../repositories/expenses/interfaces/IExpensesRepository";
import { ExpenseType } from "@prisma/client";

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

describe("ExpenseService", () => {
    let mockExpenseRepository: jest.Mocked<IExpensesRepository>;
    let expenseService: ExpenseService;

    const expenseMock: expensePrisma = {
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

    beforeEach(() => {
        mockExpenseRepository = {
            GetAll: jest.fn(),
            GetPerId: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            UpdatePaidProperty: jest.fn(),
            Delete: jest.fn(),
        };
        expenseService = new ExpenseService(mockExpenseRepository);
    });

    test("should get all expenses by userId", async () => {
        mockExpenseRepository.GetAll.mockResolvedValue([expenseMock]);

        const expenses = await expenseService.GetAll(expenseMock.userId);

        expect(expenses).toEqual([expenseMock]);
        expect(mockExpenseRepository.GetAll).toHaveBeenCalledWith(
            expenseMock.userId,
        );
    });

    test("should get expense by id and userId", async () => {
        mockExpenseRepository.GetPerId.mockResolvedValue(expenseMock);

        const expense = await expenseService.GetPerId(
            expenseMock.id,
            expenseMock.userId,
        );

        expect(expense).toEqual(expenseMock);
        expect(mockExpenseRepository.GetPerId).toHaveBeenCalledWith(
            expenseMock.userId,
            expenseMock.id,
        );
    });

    test("should throw BaseException when expense not found by id", async () => {
        mockExpenseRepository.GetPerId.mockResolvedValue(null);

        await expect(
            expenseService.GetPerId("exp-123", "user-123"),
        ).rejects.toThrow(
            new BaseException("Expense not exists", HttpStatusCode.BAD_REQUEST),
        );
    });

    test("should create a new expense", async () => {
        mockExpenseRepository.Create.mockResolvedValue(expenseMock);

        const expenseDto = {
            name: expenseMock.name,
            type: expenseMock.type,
            paid: expenseMock.paid,
            categoryId: expenseMock.categoryId,
            value: expenseMock.value,
        };

        const expense = await expenseService.Create(
            expenseMock.userId,
            expenseDto,
        );

        expect(expense).toEqual(expenseMock);
        expect(mockExpenseRepository.Create).toHaveBeenCalledWith(
            expenseDto,
            expenseMock.userId,
        );
    });

    test("should update an expense", async () => {
        const updatedExpenseMock = {
            ...expenseMock,
            name: "Condomínio",
            updatedAt: new Date(),
        };

        mockExpenseRepository.GetPerId.mockResolvedValue(expenseMock);
        mockExpenseRepository.Update.mockResolvedValue(updatedExpenseMock);

        const expenseDto = {
            name: updatedExpenseMock.name,
            type: updatedExpenseMock.type,
            paid: updatedExpenseMock.paid,
            categoryId: updatedExpenseMock.categoryId,
            value: updatedExpenseMock.value,
        };

        const updatedExpense = await expenseService.Update(
            updatedExpenseMock.userId,
            updatedExpenseMock.id,
            expenseDto,
        );

        expect(updatedExpense).toEqual(updatedExpenseMock);
        expect(mockExpenseRepository.Update).toHaveBeenCalledWith(
            expenseDto,
            updatedExpenseMock.userId,
            updatedExpenseMock.id,
        );
    });

    test("Should update expense paid property", async () => {
        const updatedExpenseMock = {
            ...expenseMock,
            paid: true,
        };

        mockExpenseRepository.GetPerId.mockResolvedValue(expenseMock);
        mockExpenseRepository.UpdatePaidProperty.mockResolvedValue();

        await expenseService.UpdatePaidProperty(
            updatedExpenseMock.id,
            updatedExpenseMock.paid,
        );

        expect(mockExpenseRepository.UpdatePaidProperty).toHaveBeenCalledWith(
            updatedExpenseMock.id,
            updatedExpenseMock.paid,
        );
    });

    test("should throw BaseException when updating a non-existent expense", async () => {
        mockExpenseRepository.GetPerId.mockResolvedValue(null);

        const expenseDto = {
            name: "Condomínio",
            type: ExpenseType.Fixed,
            paid: false,
            categoryId: "cat-123",
            value: 200,
        };

        await expect(
            expenseService.Update("user-123", "exp-123", expenseDto),
        ).rejects.toThrow(
            new BaseException("Expense not exists", HttpStatusCode.BAD_REQUEST),
        );
    });

    test("should delete an expense", async () => {
        mockExpenseRepository.Delete.mockResolvedValue();

        await expect(
            expenseService.Delete(expenseMock.id),
        ).resolves.not.toThrow();

        expect(mockExpenseRepository.Delete).toHaveBeenCalledWith(
            expenseMock.id,
        );
    });
});
