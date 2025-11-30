import express from "express";
import { proxyRequest } from "../controllers/ApiTesterController.js";
import { VerifyToken } from "../middlewares/verifyToken.js";

const apiRouter = express.Router();

apiRouter.post("/proxy", proxyRequest);

export default apiRouter;
