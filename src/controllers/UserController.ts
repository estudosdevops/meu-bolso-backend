import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";
import IUserService from "../services/user/interfaces/IUserService";

@injectable()
export default class UserController {
    constructor(
        @inject("IUserService")
        private readonly _userService: IUserService,
    ) {}

    async GetUserPerId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const user = await this._userService.GetPerId(id);

        res.status(HttpStatusCode.OK).json(user);
    }

    async GetUserPerEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.params;

        const user = await this._userService.GetPerMail(email);

        res.status(HttpStatusCode.OK).json(user);
    }
}
