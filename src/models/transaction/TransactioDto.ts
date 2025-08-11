import { TransactionType } from "@prisma/client";
import {
    IsDateString,
    IsDefined,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from "class-validator";

export default class TransactionDto {
    @IsDefined()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Min(0.01)
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
