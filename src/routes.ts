import { Router } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/auth", authRoutes);

export default routes;
