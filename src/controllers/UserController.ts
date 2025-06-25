import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";
import IUserService from "../services/user/interfaces/IUserService";
import { BODY_REQUEST_INVALID } from "../models/utils/Constants";

@injectable()
export default class UserController {
    constructor(
        @inject("IUserService")
        private readonly _userService: IUserService,
    ) {}

    async GetUserPerId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const response = await this._userService.GetPerId(id);

        res.status(HttpStatusCode.OK).json(response);
    }

    async GetUserPerEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.params;

        const response = await this._userService.GetPerMail(email);

        res.status(HttpStatusCode.OK).json(response);
    }

    async CreateNewUser(req: Request, res: Response): Promise<void> {
        const userData = req.body;

        if (userData && Object.keys(userData).length > 0) {
            const response = await this._userService.Create(userData);

            res.status(HttpStatusCode.OK).json(response);
        } else {
            res.status(HttpStatusCode.BAD_REQUEST).json(BODY_REQUEST_INVALID);
        }
    }

    async UpdateUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const userData = req.body;

        const response = await this._userService.Update(userData, id);

        res.status(HttpStatusCode.OK).json(response);
    }

    async DeleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await this._userService.Delete(id);

        res.status(HttpStatusCode.NO_CONTENT).json();
    }
}
