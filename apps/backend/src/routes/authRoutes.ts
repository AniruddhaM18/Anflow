import { Router } from "express";
import { signinController, signupController, callback } from "../controller/authController.js";

const router: Router = Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.get("/callback", callback);

export default router