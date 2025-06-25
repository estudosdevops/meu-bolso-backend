import BankRepository from "../../../repositories/bank/BankRepository";
import { prismaMock } from "../../setup/setupPrisma";
import BankDto from "../../../models/bank/bankDto";

type bankPrisma = {
    id: string;
    compe: number;
    ispb: bigint;
    name: string;
};

describe("Success BankRepository methods", () => {
    const bankRepository = new BankRepository();

    const bankPrismaMock: bankPrisma = {
        id: "bank-123",
        compe: 123,
        ispb: BigInt("12345678901234"),
        name: "Banco XPTO",
    };

    test("should create new bank", async () => {
        prismaMock.bank.create.mockResolvedValue(bankPrismaMock);

        const bankDto = new BankDto(
            bankPrismaMock.compe,
            Number(bankPrismaMock.ispb),
            bankPrismaMock.name,
        );

        const bankCreated = await bankRepository.Create(bankDto);

        expect(bankCreated).toEqual(bankPrismaMock);
    });

    test("should get a bank by id", async () => {
        prismaMock.bank.findUnique.mockResolvedValue(bankPrismaMock);

        const bank = await bankRepository.GetPerId(bankPrismaMock.id);

        expect(bank).toEqual(bankPrismaMock);
    });

    test("should update a bank", async () => {
        const bankPrismaMockUpdated = {
            ...bankPrismaMock,
            name: "Banco Atualizado",
        };

        prismaMock.bank.update.mockResolvedValue(bankPrismaMockUpdated);

        const bankDtoUpdated = new BankDto(
            bankPrismaMockUpdated.compe,
            Number(bankPrismaMockUpdated.ispb),
            bankPrismaMockUpdated.name,
        );

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
