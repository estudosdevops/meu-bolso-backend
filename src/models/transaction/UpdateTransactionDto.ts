import { TransactionType } from "@prisma/client";
import {
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from "class-validator";

export default class UpdateTransactionDto {
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Min(0.01)
    public value!: number;

    @IsOptional()
    @IsDateString()
    public date!: Date;

    @IsOptional()
    @IsEnum(TransactionType)
    public type!: TransactionType;

    @IsOptional()
    @IsString()
    public bankAccountId!: string;

    @IsOptional()
    @IsString()
    public description!: string;

    @IsOptional()
    @IsString()
    public expenseId!: string;
}
