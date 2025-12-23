import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    source: { type: String, default: "website" },
    message: String,
  },
  { timestamps: true }
);

export default mongoose.models.Lead ||
  mongoose.model("Lead", LeadSchema);
