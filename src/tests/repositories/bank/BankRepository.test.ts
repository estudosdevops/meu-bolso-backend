import BankRepository from "../../../repositories/bank/BankRepository";
import { prismaMock } from "../../setup/setupPrisma";

type bankPrisma = {
    id: string;
    compe: number;
    ispb: string;
    name: string;
    userId: string;
};

describe("Success BankRepository methods", () => {
    const bankRepository = new BankRepository();

    const bankPrismaMock: bankPrisma = {
        id: "bank-123",
        compe: 123,
        ispb: "12345678901234",
        name: "XPTO",
        userId: "123-345",
    };

    test("should create new bank", async () => {
        prismaMock.bank.create.mockResolvedValue(bankPrismaMock);

        const bankDto = {
            name: "XPTO",
            compe: 123,
            ispb: "12345678901234",
            userId: "123-345",
        };

        const bankCreated = await bankRepository.Create(bankDto);

        expect(bankCreated).toEqual(bankPrismaMock);
    });

    test("should get a bank by id", async () => {
        prismaMock.bank.findUnique.mockResolvedValue(bankPrismaMock);

        const bank = await bankRepository.GetPerId(bankPrismaMock.id);

        expect(bank).toEqual(bankPrismaMock);
    });

    test("Should get a list of banks", async () => {
        prismaMock.bank.findMany.mockResolvedValue([bankPrismaMock]);

        const banks = await bankRepository.GetAll(bankPrismaMock.userId);

        expect(banks.length).toBeGreaterThanOrEqual(1);
    });

    test("should update a bank", async () => {
        const bankPrismaMockUpdated = {
            ...bankPrismaMock,
            name: "XPTZ",
        };

        prismaMock.bank.update.mockResolvedValue(bankPrismaMockUpdated);

        const bankDtoUpdated = {
            name: bankPrismaMockUpdated.name,
            compe: bankPrismaMockUpdated.compe,
            ispb: bankPrismaMockUpdated.ispb,
            userId: bankPrismaMockUpdated.userId,
        };

        const bank = await bankRepository.Update(
            bankDtoUpdated,
            bankPrismaMock.id,
        );

        expect(bank).toEqual(bankPrismaMockUpdated);
    });

    test("should delete a bank", async () => {
        prismaMock.bank.delete.mockResolvedValue(bankPrismaMock);

        await expect(
            bankRepository.Delete(bankPrismaMock.id),
        ).resolves.not.toThrow();
    });
});

describe("Throw BankRepository methods", () => {
    const bankRepository = new BankRepository();

    test("should throw a BaseException when bank not found", async () => {
        prismaMock.bank.findUnique.mockResolvedValue(null);

        await expect(bankRepository.GetPerId("bank-123")).resolves.toBeNull();
    });
});
