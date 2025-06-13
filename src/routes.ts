import { Router } from "express";
import helloWorld from "./controllers/hello_route";

const routes = Router();

routes.use("/hello", helloWorld);

export default routes;
