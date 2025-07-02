import { IsNotEmpty, IsEmail } from "class-validator";
import { Transform } from "class-transformer";

export default class UserWithoutPassDto {
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    public name!: string;

    @IsEmail()
    @Transform(({ value }) => value?.trim().toLowerCase())
    public email!: string;

    @IsNotEmpty()
    public cpf!: string;
}
