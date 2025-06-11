import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

// Routes
import hello from "./routes/hello_route";

app.use("/", hello);

app.listen(process.env.PORT || 3000);
