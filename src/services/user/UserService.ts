import { User } from "@prisma/client";
import IUserService from "./interfaces/IUserService";
import IUserRepository from "../../repositories/user/interfaces/IUserRepository";
import { inject, injectable } from "tsyringe";
import logger from "../../configs/logger/logger";
import UserDto from "../../models/user/UserDto";

@injectable()
export default class UserService implements IUserService {
    constructor(
        @inject("IUserRepository")
        private readonly _userRepository: IUserRepository,
    ) {}

    private readonly _logger = logger;

    private readonly METHOD_NAME = "UserService";

    async GetPerId(id: string): Promise<User> {
        this._logger.info(
            `[${this.METHOD_NAME}] Getting user information per id | UserId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );

        const user = await this._userRepository.GetPerId(id);

        this._logger.info(
            `[${this.METHOD_NAME}] User founded with successfully | UserId: ${id}`,
            {
                method_name: this.METHOD_NAME,
                userId: id,
            },
        );

        return user;
    }

    async GetPerMail(email: string): Promise<User> {
        return await this._userRepository.GetPerMail(email);
    }

    async Create(data: UserDto): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async Update(data: UserDto, id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    async Delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
