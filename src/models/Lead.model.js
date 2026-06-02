import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
    businessName: { type: String, default: "" },
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
    message: String,
  },
  { timestamps: true }
);

// Delete cached model to prevent stale schema issues across hot-reloads
if (mongoose.models.Lead) {
  delete mongoose.models.Lead;
}

export default mongoose.model("Lead", LeadSchema);
