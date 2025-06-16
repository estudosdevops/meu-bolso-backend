import routes from "./routes";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

// Middlewares
app.use(errorHandlerMiddleware);

app.listen(process.env.PORT || 3000);
