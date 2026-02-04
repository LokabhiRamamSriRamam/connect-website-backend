import express from "express";
import Staff from "../models/Staff.model.js";

const router = express.Router();

// ✅ GET /api/staff - Get all staff (admin only in production)
router.get("/", async (req, res) => {
  try {
    const { companyName, role, isActive, limit = 50, page = 1 } = req.query;
    
    // Build filter
    const filter = {};
    if (companyName) filter.companyName = companyName;
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Pagination
    const skip = (page - 1) * limit;
    
    const [staff, total] = await Promise.all([
      Staff.find(filter)
        .select('-password') // Never return password
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip(skip * 1),
      Staff.countDocuments(filter)
    ]);

    res.json({
      success: true,
      staff,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error("GET staff error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /api/staff/:id - Get single staff
router.get("/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select('-password');
    
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.json({
      success: true,
      staff
    });

  } catch (err) {
    console.error("GET staff by ID error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /api/staff/stats - Staff statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await Staff.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] } }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
          byRole: { $push: "$$ROOT" }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || { total: 0, byRole: [] }
    });

  } catch (err) {
    console.error("GET staff stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
