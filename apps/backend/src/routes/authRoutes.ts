import { Router } from "express";
import { signinController, signupController, callback, getMe } from "../controller/authController.js";

const authRouter: Router = Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.get("/callback", callback);
authRouter.get("/me", getMe);


export default authRouter