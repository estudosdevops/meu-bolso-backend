import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../enums/HttpStatusCode";

import BaseException from "../models/bases/BaseException";
import BaseResponse from "../models/bases/BaseResponse";

export default function errorHandlerMiddleware(
    err: Error & Partial<BaseException>,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const statusCode = err.statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR;

    const response = new BaseResponse(false, err.message, statusCode, null);

    return void res.status(statusCode).json(response);
}
