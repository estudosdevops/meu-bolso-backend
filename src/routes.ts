import { Router } from "express";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import bankRoutes from "./routes/bankRoutes";
import bankAccountsRoutes from "./routes/bankAccountRoutes";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/bank", bankRoutes);
routes.use("/bank/accounts", bankAccountsRoutes);

export default routes;
