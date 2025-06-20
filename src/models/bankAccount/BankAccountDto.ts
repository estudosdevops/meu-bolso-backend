export default class BankAccountDto {
    constructor(
        public accountNumber: string,
        public agency: number,
        public balance: number,
        public bankId: string,
    ) {}
}
