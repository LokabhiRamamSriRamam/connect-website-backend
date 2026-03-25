import express from "express";
import Application from "../models/Application.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
