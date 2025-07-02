import { User } from "@prisma/client";

import UserDto from "../../../models/user/UserDto";
import UserWithoutPassDto from "../../../models/user/UserWithoutPassDto";

export default interface IUserRepository {
    GetPerId(id: string): Promise<User | null>;

    GetPerMail(email: string): Promise<User | null>;

    Create(data: UserDto): Promise<User>;

    Update(data: UserWithoutPassDto, id: string): Promise<User>;

    Delete(id: string): Promise<void>;
}
