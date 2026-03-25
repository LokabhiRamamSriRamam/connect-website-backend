import express from "express";
import SaarthiUser from "../models/SaarthiUser.model.js";
import { sendSaarthiLeadNotification } from "../utils/email.js";

const router = express.Router();

// GET /api/saarthi/check-mobile/:mobile — uniqueness check (called on-blur from frontend)
router.get("/check-mobile/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;
    const existing = await SaarthiUser.findOne({ mobile });
    res.json({ exists: !!existing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/saarthi — register user + fire email notification
router.post("/", async (req, res) => {
  try {
    const { name, mobile, email, designation, companyName } = req.body;

    const user = await SaarthiUser.create({
      name,
      mobile,
      email: email || undefined,
      designation,
      companyName,
      source: "saarthi_smartreport",
    });

    // Non-blocking — email failure must not block the 201 response
    sendSaarthiLeadNotification(user).catch((err) =>
      console.error("Saarthi email notification failed:", err.message)
    );

    res.status(201).json({ success: true, user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Mobile already registered" });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
