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

    // Respond immediately — email is fire-and-forget. A broken SMTP config
    // (expired app password etc.) must never time out the lead submission.
    res.status(201).json({ success: true, id: lead._id });

    sendContactLeadNotification(lead).catch((err) =>
      console.error("Contact lead email notification failed:", err.message)
    );
    if (lead.email) {
      sendContactCustomerConfirmation(lead).catch((err) =>
        console.error("Customer confirmation email failed:", err.message)
      );
    }
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

/**
 * Public counter for the "first 50 customers" scheme on /get-in-touch.
 *
 * Counts Screen Bazaar leads only — the offer is signage-only, so a Vital or
 * Saarthi enquiry must not eat a seat. Returns a bare {count, total} and
 * nothing else: this is the one lead route a visitor's browser may call.
 */
const OFFER_TOTAL = 50;

router.get("/count", async (req, res) => {
  try {
    const count = await Lead.countDocuments({
      service: new RegExp("^Screen Bazaar"),
    });
    res.set("Cache-Control", "public, max-age=60");
    res.json({ count: Math.min(count, OFFER_TOTAL), total: OFFER_TOTAL });
  } catch (err) {
    console.error("Lead count error:", err.message);
    res.status(500).json({ error: "Could not read the count." });
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
