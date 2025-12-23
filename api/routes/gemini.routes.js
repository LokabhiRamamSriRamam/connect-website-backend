import express from "express";
import { runGemini } from "../utils/gemini.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  console.log("--- Backend Route Hit ---");
  console.log("Body received:", req.body);

  try {
    const { prompt } = req.body;
    if (!prompt) {
      console.error("Validation Error: No prompt in request body");
      return res.status(400).json({ error: "Prompt required" });
    }

    const response = await runGemini(prompt);
    res.json({ response });

  } catch (err) {
    console.error("Backend Router Error Stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
});

export default router;
