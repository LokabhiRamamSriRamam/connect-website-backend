import express from "express";
import Staff from "../models/Staff.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { role, companyName, email, phone, password, source } = req.body;

    // Validate companyName against exact allowed list
    const validCompanies = [
      "Tatvan Research pvt. ltd. (Ahmedabad, Gujarat)",
      "JaiNex",
      "Harish Kitchen (Thane)",
      "Dr. Juhi's Confidental Clinic (Thane)",
      "Anna's Tiffin (Thane)",
      "Subject Buddy (Mumbai)",
      "The Fit Fork (Mumbai)",
      "The Central App (Mumbai)",
      "Kollect Care (Gurgaon)",
      "GRG (Delhi)"
    ];

    if (!validCompanies.includes(companyName)) {
      return res.status(400).json({ 
        error: "Invalid company selection" 
      });
    }

    // Check if email already exists
    const existingStaff = await Staff.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingStaff) {
      return res.status(400).json({ 
        error: "Email already registered" 
      });
    }

    // Store password as plain text (exactly as requested)
    const staff = await Staff.create({
      role,
      companyName,
      email: email.toLowerCase(),
      phone,
      password,  // ✅ Plain text as requested
      source
    });

    // Remove password from response
    const { password: _, ...staffWithoutPassword } = staff.toObject();

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for verification.",
      staff: staffWithoutPassword
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
