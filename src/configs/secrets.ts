import dotenv from "dotenv";

dotenv.config();

const secrets = {
    applicatioPort: process.env.PORT || 3000,
    applicationName: process.env.APP_NAME,
    lokiHost: process.env.LOKI_HOST,
    jwt: {
        secret: process.env.JWT_SECRET || "SomeRandomSecret",
        expiresIn: Number(process.env.JWT_EXPIRES_IN) || 300,
    },
};

export default secrets;
