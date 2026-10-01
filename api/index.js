import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "../src/utils/db.js";
import registerRoutes from "../src/routes/register.routes.js";
import saarthiRoutes from "../src/routes/saarthi.routes.js";

import geminiRoutes from "../src/routes/gemini.routes.js";
import leadRoutes from "../src/routes/leads.routes.js";
import careerRoutes from "../src/routes/careers.routes.js";
import staffRoutes from "../src/routes/staff.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// DB connection middleware (safe for Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Connection failed:", err.message);
    res.status(500).json({
      error: "Database Connection Error",
      message: err.message,
    });
  }
});

app.get("/", (req, res) =>
  res.json({ status: "success", message: "API is live" })
);

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" })
);

app.use("/api/gemini", geminiRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/saarthi", saarthiRoutes);

// Malformed JSON bodies and other uncaught errors → JSON, not Express's HTML page
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: "Internal server error" });
});

// ✅ REQUIRED by Vercel
export default function handler(req, res) {
  return app(req, res);
}
