import { container } from "tsyringe";
import IUserRepository from "../repositories/user/interfaces/IUserRepository";
import UserRepository from "../repositories/user/userRepository";

container.register<IUserRepository>("IUserRepository", {
    useClass: UserRepository,
});
