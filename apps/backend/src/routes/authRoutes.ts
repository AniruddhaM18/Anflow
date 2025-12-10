import { Router } from "express";
import { signinController, signupController, callback, getMe, logout } from "../controller/authController.js";

const authRouter: Router = Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.get("/callback", callback);
authRouter.get("/me", getMe);
authRouter.post("/logout", logout);


export default authRouter