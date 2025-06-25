import { ExpenseType } from "@prisma/client";

export default class ExpensesDto {
    constructor(
        public name: string,
        public type: ExpenseType,
        public categoryId: string,
        public value?: number,
    ) {}
}
