const mongoose = require("mongoose");

// ICD-10-CM is public domain (released annually by CMS / US Dept HHS).
// Full dataset: https://www.cms.gov/medicare/coding-billing/icd-10-codes
const IcdCodeSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  billable:    { type: Boolean, default: true }
}, { timestamps: true });

// Full-text index for search endpoint
IcdCodeSchema.index({ description: "text", code: "text" });

module.exports = mongoose.model("IcdCode", IcdCodeSchema);
