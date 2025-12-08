import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createCredential, deleteCredential, getAllCredentials } from "../controller/credentialController.js";
const credentialRouter : Router = Router();

credentialRouter.post("/credential/create", authMiddleware, createCredential);
credentialRouter.get("/credential/all", authMiddleware, getAllCredentials);
credentialRouter.delete("/credential/:id", authMiddleware, deleteCredential);

export default credentialRouter