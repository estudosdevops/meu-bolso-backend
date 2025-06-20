import "reflect-metadata";
import "./configs/injectionDepenciesRegister";
import routes from "./routes";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware";
import httpResponseMiddleware from "./middlewares/HttpResponseMiddleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(httpResponseMiddleware);

app.use(routes);

app.use(errorHandlerMiddleware);

app.listen(process.env.PORT || 3000);
