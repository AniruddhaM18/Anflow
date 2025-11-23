import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js"
import credentialRouter from "./routes/credentialRoutes.js";
import workflowRouter from "./routes/workflowRouter.js";
import webhookRouter from "./routes/webhookRoutes.js";
import executionRouter from "./routes/executionRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/credentials", credentialRouter);
app.use("/api/workflows", workflowRouter);
app.use("/api/webhook", webhookRouter);
app.use("api/execute", executionRouter);


app.listen(3000, () => "Server running @:3000");