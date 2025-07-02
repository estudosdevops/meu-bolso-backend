import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";

import BaseException from "../models/bases/BaseException";
import BaseResponse from "../models/bases/BaseResponse";
import logger from "../configs/logger/logger";

export default function errorHandlerMiddleware(
    err: Error & Partial<BaseException>,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const statusCode = err.statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR;

    const response = new BaseResponse(false, err.message, statusCode, null);

    logger.error(
        `[ErrorMiddleware] Occurred an error with the requisition | ErrorMessage: ${err.message} | StatusCode: ${statusCode}`,
        {
            method_name: "ErrorMiddleware",
            errorMessage: err.message,
            statusCode: statusCode,
            error: err.error,
        },
    );

    res.status(statusCode).json(response);
}
