import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createWorkflow, deleteWorkflow, getAllWorkflows, getWorkflow, updateWorkflow } from "../controller/worflowController.js";

const workflowRouter: Router = Router();

workflowRouter.post("/workflow/create", authMiddleware, createWorkflow);
workflowRouter.get("/workflow/all", authMiddleware, getAllWorkflows);
workflowRouter.put("/workflow/:id", authMiddleware, updateWorkflow);
workflowRouter.get("/workflow/:id", authMiddleware, getWorkflow);
workflowRouter.delete("/workflow/:id", authMiddleware, deleteWorkflow);

export default workflowRouter