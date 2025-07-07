import { Router } from "express";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import bankRoutes from "./routes/bankRoutes";
import bankAccountsRoutes from "./routes/bankAccountRoutes";
import transactionsRoutes from "./routes/transactionRoutes";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/bank", bankRoutes);
routes.use("/bank/accounts", bankAccountsRoutes);
routes.use("/transactions", transactionsRoutes);

export default routes;
