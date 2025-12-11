import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js"
import credentialRouter from "./routes/credentialRoutes.js";
import workflowRouter from "./routes/workflowRouter.js";
import webhookRouter from "./routes/webhookRoutes.js";
import executionRouter from "./routes/executionRoutes.js";
import triggerRouter from "./routes/triggerRoutes.js";
import cors from "cors";

// Remove EventEmitter from here
// import { EventEmitter } from "events";
// export const executionEvents = new EventEmitter();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    // "my-domain.com"
].filter(Boolean);

app.use(cors({
    credentials: true,
    origin: true
}));

app.use("/api/auth", authRouter);
app.use("/api/credentials", credentialRouter);
app.use("/api", workflowRouter);
app.use("/api/webhook", webhookRouter);
app.use("/api/execute", executionRouter);
app.use("/api/availableTrigger", triggerRouter);

// ------------------------------
//   SSE Endpoint
// ------------------------------
import { executionEvents } from "./events/executionEvents.js"; // <-- use shared emitter

app.get("/api/v1/execute/stream", (req, res) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

    const listener = (event: any) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    executionEvents.on("update", listener);

    req.on("close", () => {
        executionEvents.off("update", listener);
        try { res.end(); } catch {}
    });
});

app.listen(3000, () => {
    console.log("Server running @ :3000");
});
