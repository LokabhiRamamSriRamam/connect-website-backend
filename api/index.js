import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";

// Import routes
import geminiRoutes from "./routes/gemini.routes.js";
import leadRoutes from "./routes/leads.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 💡 FIX: This middleware ensures the app "starts" instantly.
// The DB connection happens on the first request, not during boot-up.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    res.status(500).json({ error: "Database Connection Error" });
  }
});

app.get("/", (req, res) => res.json({ status: "Connect Backend is live! 🚀" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/gemini", geminiRoutes);
app.use("/api/leads", leadRoutes);

// Export must be the default
export default app;