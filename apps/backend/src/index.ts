import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js"
import credentialRouter from "./routes/credentialRoutes.js";
import workflowRouter from "./routes/workflowRouter.js";
import webhookRouter from "./routes/webhookRoutes.js";
import executionRouter from "./routes/executionRoutes.js";
import triggerRouter from "./routes/triggerRoutes.js";
import { EventEmitter } from "events";
import cors from "cors";

export const executionEvents = new EventEmitter();
// Increase max listeners for production to handle multiple SSE connections
executionEvents.setMaxListeners(0); // 0 means unlimited

const app = express();
app.use(express.json());
app.use(cookieParser());

// Configure CORS for both development and production
const allowedOrigins = [
    "http://localhost:5173",
    //"my domain"
].filter(Boolean);

app.use(cors({
  credentials: true,  // allow cookies (important for auth)
   origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }

}))

app.use("/api/auth", authRouter);
app.use("/api/credentials", credentialRouter);
app.use("/api/workflows", workflowRouter);
app.use("/api/webhook", webhookRouter);
app.use("/api/execute", executionRouter);
app.use("/api/availableTrigger", triggerRouter);


// SSE endpoint for real-time execution updates
app.get("/api/v1/execute/stream", (req, res) => {
    // Set CORS headers for SSE
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    
    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
    
    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: "connected", message: "SSE connection established" })}\n\n`);
    res.flushHeaders?.();

    const send = (event: any) => {
        try {
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        } catch (_err) {
            // ignore write errors
        }
    };

    const listener = (event: any) => send(event);
    executionEvents.on("update", listener);

    req.on("close", () => {
        executionEvents.off("update", listener);
        try { res.end(); } catch {}
    });
});


app.listen(3000, () => {
  console.log("Server running @ :3000");
});
