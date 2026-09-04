const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema({
  claim_id: String,
  visit_id: String,
  patient_id: String,

  provider: String,     // hospital/doctor
  payer: String,        // insurance company

  total_amount: Number,
  status: {
    type: String,
    default: "Pending" // Pending | Approved | Rejected
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  // ===== NEW OPTIONAL FIELDS (additive — old claims unaffected) =====
  payerRef: { type: mongoose.Schema.Types.ObjectId, ref: "Payer" },
  insurancePolicyRef: { type: mongoose.Schema.Types.ObjectId, ref: "InsurancePolicy" }
});

module.exports = mongoose.model("Claim", ClaimSchema);