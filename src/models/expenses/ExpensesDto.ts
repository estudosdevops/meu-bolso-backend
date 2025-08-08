import { ExpenseType } from "@prisma/client";
import {
    IsBoolean,
    IsDefined,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from "class-validator";

export default class ExpensesDto {
    @IsDefined()
    @IsString()
    public name!: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Min(0.01)
    public value!: number;

    @IsDefined()
    @IsEnum(ExpenseType)
    public type!: ExpenseType;

    @IsDefined()
    @IsBoolean()
    public paid!: boolean;

    @IsOptional()
    @IsString()
    public categoryId!: string;
}
