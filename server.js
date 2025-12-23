import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./api/utils/db.js";
import geminiRoutes from "./api/routes/gemini.routes.js";
import leadRoutes from "./api/routes/leads.routes.js";
import careerRoutes from "./api/routes/careers.routes.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ status: "Local backend running 🟢" });
});

app.use("/api/gemini", geminiRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/careers", careerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Local server running on http://localhost:${PORT}`)
);
