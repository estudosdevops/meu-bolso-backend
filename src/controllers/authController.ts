import { inject, injectable } from "tsyringe";
import IAuthService from "../services/auth/interfaces/IAuthService";
import { Request, Response } from "express";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";

@injectable()
export default class AuthController {
    constructor(
        @inject("IAuthService")
        private readonly _authService: IAuthService,
    ) {}

    async Login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        const response = await this._authService.Login(email, password);

        res.status(HttpStatusCode.OK).json(response);
    }
}
