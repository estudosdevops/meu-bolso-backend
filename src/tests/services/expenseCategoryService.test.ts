import ExpenseCategoryService from "../../services/expense/ExpenseCategoryService";
import BaseException from "../../models/bases/BaseException";
import { HttpStatusCode } from "../../models/enums/HttpStatusCode";
import IExpenseCategoryRepository from "../../repositories/expenseCategory/interfaces/IExpenseCategoryRepository";

type expenseCategoryPrisma = {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date | null;
};

describe("ExpenseCategoryService", () => {
    let mockExpenseCategoryRepository: jest.Mocked<IExpenseCategoryRepository>;
    let expenseCategoryService: ExpenseCategoryService;

    const expenseCategoryMock: expenseCategoryPrisma = {
        id: "cat-123",
        name: "Moradia",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    beforeEach(() => {
        mockExpenseCategoryRepository = {
            GetPerId: jest.fn(),
            GetAll: jest.fn(),
            Create: jest.fn(),
            Update: jest.fn(),
            Delete: jest.fn(),
        };
        expenseCategoryService = new ExpenseCategoryService(
            mockExpenseCategoryRepository,
        );
    });

    test("should get expense category by id and userId", async () => {
        mockExpenseCategoryRepository.GetPerId.mockResolvedValue(
            expenseCategoryMock,
        );

        const category = await expenseCategoryService.GetPerId(
            expenseCategoryMock.id,
            expenseCategoryMock.userId,
        );

        expect(category).toEqual(expenseCategoryMock);
        expect(mockExpenseCategoryRepository.GetPerId).toHaveBeenCalledWith(
            expenseCategoryMock.userId,
            expenseCategoryMock.id,
        );
    });

    test("should throw BaseException when expense category not found by id", async () => {
        mockExpenseCategoryRepository.GetPerId.mockResolvedValue(null);

        await expect(
            expenseCategoryService.GetPerId("cat-123", "user-123"),
        ).rejects.toThrow(
            new BaseException(
                "Expense category not exists",
                HttpStatusCode.BAD_REQUEST,
            ),
        );
    });

    test("should get all expense categories by userId", async () => {
        mockExpenseCategoryRepository.GetAll.mockResolvedValue([
            expenseCategoryMock,
        ]);

        const categories = await expenseCategoryService.GetAll(
            expenseCategoryMock.userId,
        );

        expect(categories).toEqual([expenseCategoryMock]);
        expect(mockExpenseCategoryRepository.GetAll).toHaveBeenCalledWith(
            expenseCategoryMock.userId,
        );
    });

    test("should create a new expense category", async () => {
        mockExpenseCategoryRepository.Create.mockResolvedValue(
            expenseCategoryMock,
        );

        const category = await expenseCategoryService.Create(
            expenseCategoryMock.name,
            expenseCategoryMock.userId,
        );

        expect(category).toEqual(expenseCategoryMock);
        expect(mockExpenseCategoryRepository.Create).toHaveBeenCalledWith(
            expenseCategoryMock.userId,
            expenseCategoryMock.name,
        );
    });

    test("should update an expense category", async () => {
        const updatedCategoryMock = {
            ...expenseCategoryMock,
            name: "Transporte",
            updatedAt: new Date(),
        };

        mockExpenseCategoryRepository.GetPerId.mockResolvedValue(
            expenseCategoryMock,
        );
        mockExpenseCategoryRepository.Update.mockResolvedValue(
            updatedCategoryMock,
        );

        const updatedCategory = await expenseCategoryService.Update(
            updatedCategoryMock.name,
            updatedCategoryMock.id,
            updatedCategoryMock.userId,
        );

        expect(updatedCategory).toEqual(updatedCategoryMock);
        expect(mockExpenseCategoryRepository.Update).toHaveBeenCalledWith(
            updatedCategoryMock.id,
            updatedCategoryMock.userId,
            updatedCategoryMock.name,
        );
    });

    test("should throw BaseException when updating a non-existent expense category", async () => {
        mockExpenseCategoryRepository.GetPerId.mockResolvedValue(null);

        await expect(
            expenseCategoryService.Update("Transporte", "cat-123", "user-123"),
        ).rejects.toThrow(
            new BaseException(
                "Expense category not exists",
                HttpStatusCode.BAD_REQUEST,
            ),
        );
    });

    test("should delete an expense category", async () => {
        mockExpenseCategoryRepository.Delete.mockResolvedValue();

        await expect(
            expenseCategoryService.Delete(expenseCategoryMock.id),
        ).resolves.not.toThrow();

        expect(mockExpenseCategoryRepository.Delete).toHaveBeenCalledWith(
            expenseCategoryMock.id,
        );
    });
});
