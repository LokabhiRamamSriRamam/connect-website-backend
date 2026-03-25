import express from "express";
import Staff from "../models/Staff.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { role, companyName, email, phone, password, source } = req.body;

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
      password, // plain text
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
