import { Router } from "express";
import { createTrigger, getAllTriggers } from "../controller/triggerController.js";

const triggerRouter : Router = Router();

triggerRouter.post("/", createTrigger);
triggerRouter.get("/", getAllTriggers);

export default triggerRouter
