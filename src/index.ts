import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes       from "./routes/auth";
import productRoutes    from "./routes/products";
import uploadRoutes     from "./routes/upload";
import testimonialRoutes from "./routes/testimonials";
import newsletterRoutes  from "./routes/newsletter";

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/auth",         authRoutes);
app.use("/api/products",     productRoutes);
app.use("/api/upload",       uploadRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/newsletter",   newsletterRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message ?? "Internal server error" });
});

connectDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`)))
  .catch(err => { console.error("DB connection failed:", err); process.exit(1); });
