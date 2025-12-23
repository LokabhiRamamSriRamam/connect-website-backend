import dotenv from "dotenv"; // 1. Import dotenv
import express from "express";
import cors from "cors";

import connectDB from "./utils/db.js";

import geminiRoutes from "./routes/gemini.routes.js";
import leadRoutes from "./routes/leads.routes.js";
import careerRoutes from "./routes/careers.routes.js";

// 2. Initialize config BEFORE any other logic
dotenv.config(); 

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- DB INIT -------------------- */
// Now connectDB can safely access process.env.MONGO_URI
connectDB();

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

app.use("/api/gemini", geminiRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/careers", careerRoutes);

/* -------------------- VERCEL EXPORT -------------------- */
// ✅ Vercel needs the express app instance exported as default
export default app;