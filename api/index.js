import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "../src/utils/db.js";
import registerRoutes from "../src/routes/register.routes.js";
import saarthiRoutes from "../src/routes/saarthi.routes.js";

import geminiRoutes from "../src/routes/gemini.routes.js";
import leadRoutes from "../src/routes/leads.routes.js";

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
  res.json({ status: "ok" })
);

app.use("/api/gemini", geminiRoutes);
app.use("/api/leads", leadRoutes);

app.use("/api/register", registerRoutes);
app.use("/api/saarthi", saarthiRoutes);

// ✅ REQUIRED by Vercel
export default function handler(req, res) {
  return app(req, res);
}
