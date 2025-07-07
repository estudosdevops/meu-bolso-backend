import { TransactionType } from "@prisma/client";
import {
    IsDateString,
    IsDefined,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export default class TransactionDto {
    @IsDefined()
    @IsNumber()
    public value!: number;

    @IsDefined()
    @IsDateString()
    public date!: Date;

    @IsDefined()
    @IsEnum(TransactionType)
    public type!: TransactionType;

    @IsDefined()
    @IsString()
    public userId!: string;

    @IsDefined()
    @IsString()
    public bankAccountId!: string;

    @IsOptional()
    @IsString()
    public description!: string;

    @IsOptional()
    @IsString()
    public expenseId!: string;
}
