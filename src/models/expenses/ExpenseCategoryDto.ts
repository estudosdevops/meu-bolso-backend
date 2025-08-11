import { IsDefined, IsString } from "class-validator";

export default class ExpenseCategoryDto {
    @IsDefined()
    @IsString()
    public name!: string;
}
