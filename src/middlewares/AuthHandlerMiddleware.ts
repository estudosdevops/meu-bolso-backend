import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";

const PUBLIC_ROUTES: { method: string; path: string }[] = [
    { method: "POST", path: "/user" },
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

    res.status(HttpStatusCode.UNAUTHORIZED).send();
}
