import { Request, Response, Router } from "express";
import { HttpStatusCode } from "../enums/HttpStatusCode";

import Hello from "../models/hello";
import BaseException from "../models/bases/BaseException";
import BaseResponse from "../models/bases/BaseResponse";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  try {
    const h = new Hello();

    const apiResponse = new BaseResponse<Hello>(
      true,
      "OK",
      HttpStatusCode.OK,
      h,
    );

    res.status(200).json(apiResponse);
  } catch (error: unknown) {
    throw new BaseException(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      HttpStatusCode.INTERNAL_SERVER_ERROR.toString(),
      error,
    );
  }
});

export default router;
