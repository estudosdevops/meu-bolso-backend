import { NextFunction, Request, Response } from "express";
import BaseResponse from "../models/bases/BaseResponse";

export default function httpResponseMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const originalJson = res.json;

    res.json = function (body: unknown): Response {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const formatted = new BaseResponse<unknown>(
                true,
                res.statusMessage,
                res.statusCode,
                body,
            );

            return originalJson.call(this, formatted);
        }

        return originalJson.call(this, body);
    };

    next();
}
