import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";

import geminiRoutes from "./routes/gemini.routes.js";
import leadRoutes from "./routes/leads.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ FIX: This middleware connects to the DB only when a request hits.
// This allows Vercel to see the 'export default app' immediately.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Connection failed inside middleware:", err.message);
    // Don't let the process crash; send a JSON error instead
    res.status(500).json({ error: "Database Connection Error", message: err.message });
  }
});

app.get("/", (req, res) => res.json({ status: "success", message: "API is live" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/gemini", geminiRoutes);
app.use("/api/leads", leadRoutes);

export default app;