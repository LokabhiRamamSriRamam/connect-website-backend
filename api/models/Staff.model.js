import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    role: { 
      type: String, 
      enum: ["owner", "manager", "sales"], 
      required: true 
    },
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    source: {
      type: String,
      default: "website"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
