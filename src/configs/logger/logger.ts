import winston, { format } from "winston";
import LokiTransport from "winston-loki";
import dotenv from "dotenv";

dotenv.config();

const lokiOptions = {
    host: process.env.LOKI_HOST || "http://localhost:3100",
    json: true,
    labels: {
        app: process.env.APP_NAME || "finance-system",
    },
    format: format.json(),
    replaceTimestamp: true,
};

const { combine, timestamp, printf, colorize } = winston.format;

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize({
                    level: true,
                }),
                timestamp({
                    format: "YYYY-MM-DD hh:mm:ss.SSS A",
                }),
                printf(
                    (info) =>
                        `[${info.timestamp}] ${info.level}: ${info.message}`,
                ),
            ),
        }),
        new LokiTransport({
            ...lokiOptions,
            onConnectionError: (err): void => console.error(err),
        }),
    ],
});

export default logger;
