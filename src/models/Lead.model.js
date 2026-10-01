import mongoose from "mongoose";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Digits with optional +, spaces, dashes, dots, brackets — 7 to 15 digits total.
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 100 },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 200,
      validate: {
        validator: (v) => !v || EMAIL_RE.test(v),
        message: "Please enter a valid email address",
      },
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      validate: {
        validator: (v) => !v || (PHONE_RE.test(v) && v.replace(/\D/g, "").length >= 7 && v.replace(/\D/g, "").length <= 15),
        message: "Please enter a valid phone number",
      },
    },
    businessName: { type: String, default: "", trim: true, maxlength: 150 },
    city: { type: String, default: "", trim: true, maxlength: 100 },
    industry: { type: String, default: "", trim: true, maxlength: 100 },
    service: { type: String, default: "", trim: true, maxlength: 100 },
    screenSource: { type: String, default: "", trim: true, maxlength: 60 },
    screenKind: { type: String, default: "", trim: true, maxlength: 80 },
    scale: { type: String, default: "", trim: true, maxlength: 40 },
    screens: { type: String, default: "", trim: true, maxlength: 20 },
    // Vital.AI
    specialty: { type: String, default: "", trim: true, maxlength: 60 },
    clinicians: { type: String, default: "", trim: true, maxlength: 20 },
    // Molaris.AI
    chairs: { type: String, default: "", trim: true, maxlength: 20 },
    // Nexus CRM
    teamSize: { type: String, default: "", trim: true, maxlength: 20 },
    leadVolume: { type: String, default: "", trim: true, maxlength: 30 },
    // Saarthi AI
    businessType: { type: String, default: "", trim: true, maxlength: 40 },
    // Saarthi for Contractors
    workers: { type: String, default: "", trim: true, maxlength: 20 },
    sites: { type: String, default: "", trim: true, maxlength: 20 },
    // Beauty Manager
    salonType: { type: String, default: "", trim: true, maxlength: 40 },
    stylists: { type: String, default: "", trim: true, maxlength: 20 },
    branches: { type: String, default: "", trim: true, maxlength: 20 },
    source: {
      type: String,
      enum: [
        "website",
        "website_contact_form",
        "referral",
        "social_media",
        "other",
      ],
      default: "website_contact_form",
    },
    message: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

// A lead we can't reach is useless — require at least one way to get back to them.
LeadSchema.pre("validate", function () {
  if (!this.email && !this.phone) {
    this.invalidate("phone", "Please share a phone number or email so we can reach you");
  }
});

// Delete cached model to prevent stale schema issues across hot-reloads
if (mongoose.models.Lead) {
  delete mongoose.models.Lead;
}

export default mongoose.model("Lead", LeadSchema);
