import BaseException from "../../../models/bases/BaseException";
import { HttpStatusCode } from "../../../models/enums/HttpStatusCode";
import ExpenseCategoryRepository from "../../../repositories/expenseCategory/ExpenseCategoryRepository";
import { prismaMock } from "../../setup/setupPrisma";

// Type baseado no schema.prisma
type expenseCategoryPrisma = {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date | null;
};

describe("Success ExpenseCategoryRepository methods", () => {
    const expenseCategoryRepository = new ExpenseCategoryRepository();

    const expenseCategoryPrismaMock: expenseCategoryPrisma = {
        id: "cat-123",
        name: "Moradia",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: null,
    };

    test("should create new expense category", async () => {
        prismaMock.expenseCategory.create.mockResolvedValue(
            expenseCategoryPrismaMock,
        );

        const expenseCategoryCreated = await expenseCategoryRepository.Create(
            expenseCategoryPrismaMock.userId,
            expenseCategoryPrismaMock.name,
        );

        expect(expenseCategoryCreated).toEqual(expenseCategoryPrismaMock);
    });

    test("should get all expense categories by userId", async () => {
        prismaMock.expenseCategory.findMany.mockResolvedValue([
            expenseCategoryPrismaMock,
        ]);

        const categories = await expenseCategoryRepository.GetAll(
            expenseCategoryPrismaMock.userId,
        );

        expect(categories).toEqual([expenseCategoryPrismaMock]);
    });

    test("should get an expense category by id and userId", async () => {
        prismaMock.expenseCategory.findUnique.mockResolvedValue(
            expenseCategoryPrismaMock,
        );

        const category = await expenseCategoryRepository.GetPerId(
            expenseCategoryPrismaMock.userId,
            expenseCategoryPrismaMock.id,
        );

        expect(category).toEqual(expenseCategoryPrismaMock);
    });

    test("should update an expense category", async () => {
        const expenseCategoryPrismaMockUpdated = {
            ...expenseCategoryPrismaMock,
            name: "Transporte",
            updatedAt: new Date(),
        };

        prismaMock.expenseCategory.update.mockResolvedValue(
            expenseCategoryPrismaMockUpdated,
        );

        const category = await expenseCategoryRepository.Update(
            expenseCategoryPrismaMock.id,
            expenseCategoryPrismaMock.userId,
            expenseCategoryPrismaMockUpdated.name,
        );

        expect(category).toEqual(expenseCategoryPrismaMockUpdated);
        expect(category.updatedAt).not.toBeNull();
    });

    test("should delete an expense category", async () => {
        prismaMock.expenseCategory.delete.mockResolvedValue(
            expenseCategoryPrismaMock,
        );

        await expect(
            expenseCategoryRepository.Delete(expenseCategoryPrismaMock.id),
        ).resolves.not.toThrow();
    });
});

describe("Throw ExpenseCategoryRepository methods", () => {
    const expenseCategoryRepository = new ExpenseCategoryRepository();
    const CATEGORY_NOT_FOUND_MESSAGE = "Expense category not found";

    test("should throw a BaseException when expense category not found", async () => {
        prismaMock.expenseCategory.findUnique.mockResolvedValue(null);

        await expect(
            expenseCategoryRepository.GetPerId("user-123", "cat-123"),
        ).rejects.toEqual(
            new BaseException(
                CATEGORY_NOT_FOUND_MESSAGE,
                HttpStatusCode.NOT_FOUND,
            ),
        );
    });
});
