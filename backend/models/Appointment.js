const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient_id: String,
  patient_user_id: String,
  doctor_name: String,
  doctor_user_id: String,
  date: String,
  time: String,
  status: {
    type: String,
    default: "Scheduled"
  },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Appointment", appointmentSchema);