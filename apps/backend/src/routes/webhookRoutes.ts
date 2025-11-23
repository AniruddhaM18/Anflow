import { Router } from "express";
import { webHookTrigger } from "../controller/webhookController.js";

const webhookRouter:Router = Router();

// no auth coz it's a public endpoint anyone can hit it.
webhookRouter.get("/:workflowId", webHookTrigger);

export default webhookRouter;
