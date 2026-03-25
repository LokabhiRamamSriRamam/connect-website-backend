import mongoose from "mongoose";

const SaarthiUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    designation: {
      type: String,
      required: true,
      enum: [
        "CEO",
        "Owner / Proprietor",
        "Managing Partner",
        "General Manager",
        "Manager",
        "Director",
        "Other",
      ],
    },
    companyName: { type: String, required: true, trim: true },
    source: { type: String, default: "saarthi_smartreport" },
    reportData: {
      monthlySales: Number,
      inventoryValue: Number,
      slowStockPct: Number,
      marginPct: Number,
      restockDays: Number,
      inventoryTurnover: Number,
      deadStock: Number,
      daysToSell: Number,
      monthlyLeakage: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SaarthiUser ||
  mongoose.model("SaarthiUser", SaarthiUserSchema);
