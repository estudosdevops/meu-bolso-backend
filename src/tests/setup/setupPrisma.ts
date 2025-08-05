import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import prisma from "../../configs/db/prisma";

jest.mock("../../configs/db/prisma", () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
    mockReset(prismaMock);

    prismaMock.$transaction = jest
        .fn()
        .mockImplementation(
            async <T>(cb: (tx: PrismaClient) => Promise<T>): Promise<T> => {
                return cb(prismaMock);
            },
        ) as typeof prismaMock.$transaction;
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
