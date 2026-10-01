import express from "express";
import Lead from "../models/Lead.model.js";
import { sendContactLeadNotification, sendContactCustomerConfirmation } from "../utils/email.js";

const router = express.Router();

// Only these fields can be set from the public contact form.
const LEAD_FIELDS = [
  "name", "email", "phone", "businessName", "city", "industry", "service",
  "screenSource", "screenKind", "scale", "screens",
  "specialty", "clinicians",
  "chairs",
  "teamSize", "leadVolume",
  "businessType",
  "workers", "sites",
  "salonType", "stylists", "branches",
  "message", "source",
];

const pick = (body = {}) =>
  Object.fromEntries(
    LEAD_FIELDS.filter((k) => typeof body[k] === "string").map((k) => [k, body[k]])
  );

router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create(pick(req.body));

    // Awaited so serverless (Vercel) doesn't freeze the function before the email goes out,
    // but an email failure must never fail the lead — it's already saved.
    let emailed = true;
    try {
      await sendContactLeadNotification(lead);
    } catch (err) {
      emailed = false;
      console.error("Contact lead email notification failed:", err.message);
    }

    // Customer's own confirmation — separate from the internal notification above.
    if (lead.email) {
      try {
        await sendContactCustomerConfirmation(lead);
      } catch (err) {
        console.error("Customer confirmation email failed:", err.message);
      }
    }

    res.status(201).json({ success: true, id: lead._id, emailed });
  } catch (err) {
    if (err.name === "ValidationError") {
      const fields = Object.fromEntries(
        Object.entries(err.errors).map(([k, v]) => [k, v.message])
      );
      return res.status(400).json({ error: Object.values(fields)[0], fields });
    }
    console.error("Create lead error:", err);
    res.status(500).json({ error: "Could not save your message. Please try again." });
  }
});

router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
