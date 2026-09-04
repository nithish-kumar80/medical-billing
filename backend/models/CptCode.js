const mongoose = require("mongoose");

// LICENSING NOTE:
// CPT codes are copyrighted by the American Medical Association (AMA).
// A paid AMA license is required before using the full CPT code set commercially.
// This model is seeded with HCPCS Level II codes (public domain, published by CMS)
// as the dev/demo starter set. Obtain an AMA CPT license before production.
const CptCodeSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  codeSystem:  { type: String, enum: ["CPT", "HCPCS"], required: true },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

// Full-text index for search endpoint
CptCodeSchema.index({ description: "text", code: "text" });

module.exports = mongoose.model("CptCode", CptCodeSchema);
