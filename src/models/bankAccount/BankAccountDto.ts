import { IsDefined, IsNumber } from "class-validator";

export default class BankAccountDto {
    @IsDefined()
    public accountNumber!: string;

    @IsDefined()
    public agency!: string;

    @IsDefined()
    @IsNumber()
    public balance!: number;

    @IsDefined()
    public bankId!: string;

    @IsDefined()
    public userId!: string;
}
