import { Router } from "express";
import { createTrigger, getAllTriggers } from "../controller/triggerController.js";

const triggerRouter : Router = Router();

triggerRouter.post("/trigger/", createTrigger);
triggerRouter.get("/trigger/", getAllTriggers);

export default triggerRouter
