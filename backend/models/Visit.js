const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  visit_id: String,
  patient_id: String,
  diagnosis: String,
  treatment: String,
  amount: Number,
  doctor: String,
  department: String,
  symptoms: String,
  visit_date: {
    type: Date,
    default: Date.now
  },

  // ===== IN-PATIENT (IP) FIELDS (all optional, default false/undefined) =====
  admitted: {
    type: Boolean,
    default: false
  },
  admissionDetails: {
    admissionDate: Date,
    ward: String,       // ICU | General | Private
    roomNumber: String,
    bedNumber: String,
    attendingDoctor: String
  },
  dailyCharges: [{
    type: { type: String },  // Room | ICU | Nursing | Medicine
    amount: Number,
    date: Date
  }],
  dischargeDetails: {
    dischargeDate: Date,
    summary: String,
    finalDiagnosis: String
  },

  // ===== NEW OPTIONAL FIELDS (additive — old visits unaffected) =====
  practiceRef: { type: mongoose.Schema.Types.ObjectId, ref: "Practice" },
  renderingProviderRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  codeValidation: {
    icdVerified: Boolean,
    cptVerified: Boolean
  }
});

module.exports = mongoose.model("Visit", visitSchema);