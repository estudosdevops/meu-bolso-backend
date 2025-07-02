import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";
import secrets from "../configs/secrets";
import logger from "../configs/logger/logger";
import { jwtPayload } from "../types/jwtPayload";

const PUBLIC_ROUTES: { method: string; path: string }[] = [
    { method: "POST", path: "/user" },
    { method: "POST", path: "/auth/login" },
    { method: "POST", path: "/auth/refresh" },
];

export default function authHandlerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const isPublic = PUBLIC_ROUTES.some(
        (route) => route.method === req.method && route.path === req.path,
    );

    if (isPublic) {
        return next();
    }

    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        res.status(HttpStatusCode.UNAUTHORIZED).send();
    }

    if (token != undefined) {
        try {
            const payload = verify(token.split(" ")[1], secrets.jwt.secret, {
                ignoreExpiration: false,
            }) as jwtPayload;

            logger.info(
                `[AuthMiddleware] Token is valid | UserId: ${payload.id}`,
                {
                    method_name: "AuthMiddleware",
                    userId: payload.id,
                },
            );

            return next();
        } catch (error) {
            const errorConverted = error as JsonWebTokenError;

            logger.error(
                `[AuthMiddleware] Token invalid | Reason: ${errorConverted.message}`,
                {
                    method_name: "AuthMiddleware",
                    errorConverted,
                },
            );

            res.status(HttpStatusCode.UNAUTHORIZED).send();
        }
    } else {
        res.status(HttpStatusCode.UNAUTHORIZED).send();
    }
}
