import { TransactionType } from "@prisma/client";

export default class TransactionDto {
    constructor(
        public value: number,
        public date: Date,
        public type: TransactionType,

        public userId: string,
        public bankAccountId: string,

        public description?: string,
        public expenseId?: string,
    ) {}
}
