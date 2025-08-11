import {
    IsDefined,
    IsNumber,
    IsNumberString,
    IsOptional,
} from "class-validator";

export default class BankDto {
    @IsDefined()
    name!: string;

    @IsNumber()
    @IsOptional()
    compe!: number;

    @IsOptional()
    @IsNumberString()
    ispb!: string;

    @IsDefined()
    userId!: string;
}
