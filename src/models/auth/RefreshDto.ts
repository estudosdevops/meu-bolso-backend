import { IsDefined } from "class-validator";

export default class RefreshDto {
    @IsDefined()
    refreshToken!: string;

    @IsDefined()
    userId!: string;
}
