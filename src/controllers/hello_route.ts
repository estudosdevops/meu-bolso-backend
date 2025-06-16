import { Request, Response, Router } from "express";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import Hello from "../models/hello";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    const he = new Hello();

    res.status(HttpStatusCode.OK).json(he);
});

export default router;
