// validation.middleware.ts
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import BaseException from "../models/bases/BaseException";
import { BODY_REQUEST_INVALID } from "../models/utils/Constants";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";

export function validationMiddleware<T>(
    dtoClass: new () => T,
): (req: Request, res: Response, next: NextFunction) => void {
    return async (req, res, next) => {
        const dtoObj = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoObj as object, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            throw new BaseException(
                BODY_REQUEST_INVALID,
                HttpStatusCode.BAD_REQUEST,
            );
        }

        req.body = dtoObj;
        next();
    };
}
