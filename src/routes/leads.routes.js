import express from "express";
import Lead from "../models/Lead.model.js";
import { sendContactLeadNotification } from "../utils/email.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    // Non-blocking — email failure must not block the 201 response
    sendContactLeadNotification(lead).catch((err) =>
      console.error("Contact lead email notification failed:", err.message)
    );
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
});

export default router;
