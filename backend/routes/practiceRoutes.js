const express  = require("express");
const router   = express.Router();
const Practice = require("../models/Practice");
const AuditLog = require("../models/AuditLog");

// POST /api/practices — create a practice
router.post("/practices", async (req, res) => {
  try {
    const practice = new Practice(req.body);
    await practice.save();

    await AuditLog.create({
      action: "CREATE_PRACTICE",
      entity: "Practice",
      entityId: practice._id,
      diff: req.body
    });

    res.status(201).json(practice);
  } catch (err) {
    console.error("CREATE_PRACTICE error:", err);
    res.status(500).json({ error: "Error creating practice" });
  }
});

// GET /api/practices — list all active practices
router.get("/practices", async (req, res) => {
  try {
    const practices = await Practice.find({ isActive: true }).sort({ name: 1 });
    res.json(practices);
  } catch (err) {
    res.status(500).json({ error: "Error fetching practices" });
  }
});

// GET /api/practices/:id — single practice
router.get("/practices/:id", async (req, res) => {
  try {
    const practice = await Practice.findById(req.params.id);
    if (!practice) return res.status(404).json({ error: "Practice not found" });
    res.json(practice);
  } catch (err) {
    res.status(500).json({ error: "Error fetching practice" });
  }
});

// PATCH /api/practices/:id — update practice
router.patch("/practices/:id", async (req, res) => {
  try {
    const before   = await Practice.findById(req.params.id).lean();
    const practice = await Practice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!practice) return res.status(404).json({ error: "Practice not found" });

    await AuditLog.create({
      action: "UPDATE_PRACTICE",
      entity: "Practice",
      entityId: practice._id,
      diff: { before, after: req.body }
    });

    res.json(practice);
  } catch (err) {
    res.status(500).json({ error: "Error updating practice" });
  }
});

module.exports = router;
