import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    role: String,
    resumeUrl: String,
    coverLetter: String,
  },
  { timestamps: true }
);

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
