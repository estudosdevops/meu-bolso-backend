import { IsDefined, IsEmail } from "class-validator";

export default class AuthDto {
    @IsDefined()
    @IsEmail()
    email!: string;

    @IsDefined()
    password!: string;
}
