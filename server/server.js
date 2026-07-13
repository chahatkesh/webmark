import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import bookmarkRouter from "./routes/bookmarkRoute.js";
import statsRoute from "./routes/statsRoute.js";
import clickRoute from "./routes/clickRoute.js";
import cronRoute from "./routes/cronRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import adminRoute from "./routes/adminRoute.js";
import { initializeCronJobs } from "./utils/cronJobs.js";
import passport from "./config/passport.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST;
const isVercel = process.env.VERCEL === "1";

const getAllowedOrigins = () => {
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || "").split(","),
  ]
    .map((origin) => origin?.trim())
    .filter(Boolean);

  return new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...configuredOrigins,
  ]);
};

const allowedOrigins = getAllowedOrigins();
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === "true";

const noOriginAllowedPaths = ["/api/cron", "/api/bookmarks/save"];

app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.has(origin)) return callback(null, true);
      if (
        allowVercelPreviews &&
        /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    exposedHeaders: ["x-device-id", "x-request-id"],
  }),
);

app.use((req, res, next) => {
  if (
    req.headers.origin ||
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    return next();
  }

  const allowed = noOriginAllowedPaths.some((path) =>
    req.path.startsWith(path),
  );
  if (allowed) return next();

  return res.status(403).json({
    success: false,
    message: "Origin header required",
  });
});

app.use(passport.initialize());

app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(503).json({ success: false, message: "Database unavailable" });
  }
});

if (!isVercel && process.env.ENABLE_LOCAL_CRON !== "false") {
  initializeCronJobs();
}

app.use("/api/user", userRouter);
app.use("/api/bookmarks", bookmarkRouter);
app.use("/api/stats", statsRoute);
app.use("/api/clicks", clickRoute);
app.use("/api/cron", cronRoute);
app.use("/api/tweets", tweetRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("API Working");
});

if (!isVercel) {
  app.listen(port, host, () => {
    console.log(`Server started on http://${host || "localhost"}:${port}`);
  });
}

export default app;
