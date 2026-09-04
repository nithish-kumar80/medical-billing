const mongoose = require("mongoose");

const InsurancePolicySchema = new mongoose.Schema({
  // Links to existing Patient by ObjectId (_id)
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
  payer:   { type: mongoose.Schema.Types.ObjectId, ref: "Payer",   required: true },

  policyRank: {
    type: String,
    enum: ["primary", "secondary", "tertiary"],
    default: "primary"
  },
  policyNumber: { type: String, required: true },
  groupNumber: String,

  subscriber: {
    isPatient: { type: Boolean, default: true },
    firstName: String,
    lastName:  String,
    dob: Date,
    relationshipToPatient: {
      type: String,
      enum: ["self", "spouse", "child", "other"],
      default: "self"
    },
    // ⚠  HIPAA: encrypt memberId at rest before going to production
    memberId: { type: String, required: true }
  },

  planType: {
    type: String,
    enum: ["HMO", "PPO", "EPO", "POS", "Medicare", "Medicaid", "SelfPay", "Other"],
    default: "Other"
  },

  coverage: {
    effectiveDate:      Date,
    terminationDate:    Date,
    copayCents:         { type: Number, default: 0 },  // stored in paise/cents (integer)
    coinsurancePercent: { type: Number, default: 0 },
    deductibleCents:    { type: Number, default: 0 },
    deductibleMetCents: { type: Number, default: 0 }
  },

  eligibility: {
    status: {
      type: String,
      enum: ["not_checked", "active", "inactive", "pending"],
      default: "not_checked"
    },
    lastCheckedAt: Date
  },

  isActive:  { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("InsurancePolicy", InsurancePolicySchema);
