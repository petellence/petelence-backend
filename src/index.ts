import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes       from "./routes/auth";
import productRoutes    from "./routes/products";
import uploadRoutes     from "./routes/upload";
import testimonialRoutes from "./routes/testimonials";
import newsletterRoutes  from "./routes/newsletter";
import contactRoutes      from "./routes/contact";

const app = express();
const PORT = process.env.PORT ?? 5000;

// CORS: if CORS_ORIGIN is set, allow only that comma-separated list; otherwise
// allow every origin. `origin: true` reflects the request's Origin header, which
// (unlike "*") stays compatible with credentials.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
  : true;

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dbReady = false;

app.get("/health", (_req, res) =>
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? "ok" : "database unavailable",
    db: dbReady ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  })
);

app.use("/api/auth",         authRoutes);
app.use("/api/products",     productRoutes);
app.use("/api/upload",       uploadRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/newsletter",   newsletterRoutes);
app.use("/api/contact",      contactRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message ?? "Internal server error" });
});

// Start listening immediately so the platform sees a healthy port even if the
// database is slow or unreachable — this surfaces a real error at /health
// instead of a silent 503 from the app never binding.
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

connectDB()
  .then(() => { dbReady = true; })
  .catch(err => console.error("DB connection failed:", err));
