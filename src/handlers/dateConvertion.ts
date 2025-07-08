import BaseException from "../models/bases/BaseException";
import { HttpStatusCode } from "../models/enums/HttpStatusCode";

export default function dateConvertion(dateString: string): Date {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new BaseException(
            "Invalid date string",
            HttpStatusCode.BAD_REQUEST,
        );
    }

    return date;
}
