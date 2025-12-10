import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { execute, getExecution } from "../controller/executionController.js";

const executionRouter: Router = Router();

executionRouter.post("/run", authMiddleware, execute);
executionRouter.get("/all", authMiddleware, getExecution);

export default executionRouter;