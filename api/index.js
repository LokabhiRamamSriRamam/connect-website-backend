import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";

// Route Imports
import geminiRoutes from "./routes/gemini.routes.js";
import leadRoutes from "./routes/leads.routes.js";
import careerRoutes from "./routes/careers.routes.js";

// 1. Initialize dotenv only in local development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors({
  origin: "*", // Adjust this to your specific frontend URL later for security
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

/* -------------------- DB INIT -------------------- */
// In Vercel, this runs on every "Cold Start"
// Make sure your connectDB function in utils/db.js uses the Singleton pattern
connectDB();

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => {
  res.json({ 
    status: "Backend running 🚀",
    message: "Connect AI Ecosystem API",
    timestamp: new Date().toISOString()
  });
});

// Primary API Routes
app.use("/api/gemini", geminiRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/careers", careerRoutes);

/* -------------------- ERROR HANDLING -------------------- */
// Global error handler to prevent 500 crashes
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: err.message 
  });
});

/* -------------------- VERCEL EXPORT -------------------- */
// Vercel handles the server start; we just export the app instance
export default app;