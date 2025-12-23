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

// 1. Move DB connection inside a light wrapper or handle it lazily
// To test if the export works, comment out connectDB() temporarily
connectDB().catch(err => console.error("Initial DB connection failed", err));

app.get("/", (req, res) => {
  res.json({ 
    status: "success", 
    message: "Connect Backend is live!" 
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Vercel accepted the export!" });
});

app.use("/api/gemini", geminiRoutes);
app.use("/api/leads", leadRoutes);

// 2. Ensure this is the very last thing and it is a DEFAULT export
export default app;