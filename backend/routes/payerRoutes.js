const express = require("express");
const router  = express.Router();
const Payer    = require("../models/Payer");
const AuditLog = require("../models/AuditLog");

// POST /api/payers — create a new payer
router.post("/payers", async (req, res) => {
  try {
    const payer = new Payer(req.body);
    await payer.save();

    await AuditLog.create({
      action: "CREATE_PAYER",
      entity: "Payer",
      entityId: payer._id,
      diff: req.body
    });

    res.status(201).json(payer);
  } catch (err) {
    console.error("CREATE_PAYER error:", err);
    res.status(500).json({ error: "Error creating payer" });
  }
});

// GET /api/payers — list all active payers
router.get("/payers", async (req, res) => {
  try {
    const payers = await Payer.find({ isActive: true }).sort({ payerName: 1 });
    res.json(payers);
  } catch (err) {
    res.status(500).json({ error: "Error fetching payers" });
  }
});

// GET /api/payers/:id — single payer
router.get("/payers/:id", async (req, res) => {
  try {
    const payer = await Payer.findById(req.params.id);
    if (!payer) return res.status(404).json({ error: "Payer not found" });
    res.json(payer);
  } catch (err) {
    res.status(500).json({ error: "Error fetching payer" });
  }
});

// PATCH /api/payers/:id — update payer
router.patch("/payers/:id", async (req, res) => {
  try {
    const before = await Payer.findById(req.params.id).lean();
    const payer  = await Payer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payer) return res.status(404).json({ error: "Payer not found" });

    await AuditLog.create({
      action: "UPDATE_PAYER",
      entity: "Payer",
      entityId: payer._id,
      diff: { before, after: req.body }
    });

    res.json(payer);
  } catch (err) {
    res.status(500).json({ error: "Error updating payer" });
  }
});

module.exports = router;
