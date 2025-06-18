import { Request, Response, Router } from "express";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import logger from "../configs/logger/logger";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    logger.info("testando o log");

    res.status(HttpStatusCode.OK).json("user");
});

export default router;
