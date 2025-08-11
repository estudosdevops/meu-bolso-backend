import "reflect-metadata";
import "./configs/injectionDepenciesRegister";
import secrets from "./configs/secrets";

import routes from "./routes";
import express from "express";
import cors from "cors";

import errorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware";
import httpResponseMiddleware from "./middlewares/HttpResponseMiddleware";
import authHandlerMiddleware from "./middlewares/AuthHandlerMiddleware";

const app = express();

app.use(express.json());
app.use(cors());

app.use(httpResponseMiddleware);

app.use(authHandlerMiddleware);

app.use(routes);

app.use(errorHandlerMiddleware);

app.listen(secrets.applicatioPort);
