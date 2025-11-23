import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createCredential, deleteCredential } from "../controller/credentialController.js";
const credentialRouter : Router = Router();

credentialRouter.post("/credential/create", authMiddleware, createCredential);
credentialRouter.delete("/credential/delete", authMiddleware, deleteCredential);

export default credentialRouter