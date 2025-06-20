import { User } from "@prisma/client";

import UserDto from "../../../models/user/UserDto";

export default interface IUserRepository {
    GetPerId(id: string): Promise<User>;

    GetPerMail(email: string): Promise<User>;

    Create(data: UserDto): Promise<User>;

    Update(data: UserDto, id: string): Promise<User>;

    Delete(id: string): Promise<"">;
}
