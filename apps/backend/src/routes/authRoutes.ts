import { Router } from "express";
import { signinController, signupController, callback } from "../controller/authController.js";

const authRouter: Router = Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.get("/callback", callback);

export default authRouter