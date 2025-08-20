import {
    IsNotEmpty,
    IsEmail,
    IsStrongPassword,
    IsOptional,
} from "class-validator";
import { Transform } from "class-transformer";

export default class UserDto {
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    public name!: string;

    @IsEmail()
    @Transform(({ value }) => value?.trim().toLowerCase())
    public email!: string;

    @IsStrongPassword()
    public password!: string;

    @IsOptional()
    public cpf!: string;
}
