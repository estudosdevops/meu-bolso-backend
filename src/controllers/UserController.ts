import { inject, injectable } from "tsyringe";
import IUserRepository from "../repositories/user/interfaces/IUserRepository";
import { Request, Response } from "express";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";

@injectable()
export default class UserController {
    constructor(
        @inject("IUserRepository")
        private readonly userRepository: IUserRepository,
    ) {}

    async GetUserPerId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const user = await this.userRepository.GetPerId(id);

        res.status(HttpStatusCode.OK).json(user);
    }
}
