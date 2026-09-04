const express  = require("express");
const router   = express.Router();
const IcdCode  = require("../models/IcdCode");
const CptCode  = require("../models/CptCode");

// GET /api/codes/icd/search?q=<query>
// Returns up to 15 matching ICD-10-CM codes.
// Falls back to prefix regex search if $text index is not yet created (Cosmos DB).
router.get("/codes/icd/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (q.length < 2) return res.json([]);

    let results;
    try {
      // Prefer full-text search (requires index on Cosmos DB — run createIndexes.js once)
      results = await IcdCode.find(
        { $text: { $search: q }, billable: true },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } }).limit(15);
    } catch (textErr) {
      // Fallback: regex prefix search (works without text index)
      const re = new RegExp(q, "i");
      results = await IcdCode.find({
        billable: true,
        $or: [{ code: re }, { description: re }]
      }).limit(15);
    }

    // Explicitly convert to plain array (Cosmos DB can wrap Mongoose results)
    res.json(Array.from(results));
  } catch (err) {
    console.error("ICD search error:", err);
    res.status(500).json({ error: "Error searching ICD codes" });
  }
});

// GET /api/codes/cpt/search?q=<query>
// Returns up to 15 matching CPT/HCPCS codes.
router.get("/codes/cpt/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (q.length < 2) return res.json([]);

    let results;
    try {
      results = await CptCode.find(
        { $text: { $search: q }, isActive: true },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } }).limit(15);
    } catch (textErr) {
      const re = new RegExp(q, "i");
      results = await CptCode.find({
        isActive: true,
        $or: [{ code: re }, { description: re }]
      }).limit(15);
    }

    res.json(Array.from(results));
  } catch (err) {
    console.error("CPT search error:", err);
    res.status(500).json({ error: "Error searching CPT codes" });
  }
});

module.exports = router;
