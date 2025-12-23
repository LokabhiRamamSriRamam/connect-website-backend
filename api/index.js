import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";

// Routes
import geminiRoutes from "./routes/gemini.routes.js";
import leadRoutes from "./routes/leads.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ FIX: Use a middleware to connect to DB. 
// This prevents the "Invalid Export" error by allowing the app to export immediately.
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
});

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Connect Backend is live!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Vercel accepted the export!" });
});

app.use("/api/gemini", geminiRoutes);
app.use("/api/leads", leadRoutes);

export default app;