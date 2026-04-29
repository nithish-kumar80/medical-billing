const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patient_id: String,    // PAT-XXXX
  patient_name: String,
  doctor_name: String,
  doctor_user_id: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
