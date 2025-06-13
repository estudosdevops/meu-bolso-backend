import { HttpStatusCode } from "../../enums/HttpStatusCode";

export default class BaseException extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly error?: unknown;

  constructor(statusCode: HttpStatusCode, message: string, error?: unknown) {
    super(message);
    this.statusCode = statusCode;

    if (error instanceof Error) {
      this.message = error.message;
    }
  }
}
