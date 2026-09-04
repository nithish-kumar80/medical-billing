const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  action:    { type: String, required: true }, // e.g. "CREATE_PAYER", "UPDATE_POLICY"
  entity:    { type: String, required: true }, // e.g. "Payer", "InsurancePolicy"
  entityId:  { type: mongoose.Schema.Types.ObjectId },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  diff:      { type: mongoose.Schema.Types.Mixed }, // snapshot of changed fields
  meta:      { type: mongoose.Schema.Types.Mixed }, // extra context
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
