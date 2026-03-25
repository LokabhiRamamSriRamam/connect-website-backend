import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./src/utils/db.js";
import geminiRoutes from "./src/routes/gemini.routes.js";
import leadRoutes from "./src/routes/leads.routes.js";
import careerRoutes from "./src/routes/careers.routes.js";
import registerRoutes from "./src/routes/register.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import saarthiRoutes from "./src/routes/saarthi.routes.js";


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
app.use("/api/register", registerRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/saarthi", saarthiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Local server running on http://localhost:${PORT}`)
);
