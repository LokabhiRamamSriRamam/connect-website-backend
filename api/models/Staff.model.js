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
      enum: [
        "Tatvan Research pvt. ltd. (Ahmedabad, Gujarat)",
        "Jay Telecom (Mau, UP)",
        "Harish Kitchen (Thane)",
        "Dr. Juhi's Confidental Clinic (Thane)",
        "Anna's Tiffin (Thane)",
        "Subject Buddy (Mumbai)",
        "The Fit Fork (Mumbai)",
        "The Central App (Mumbai)",
        "Kollect Care (Gurgaon)",
        "GRG (Delhi)"
      ]
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
