const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient_id: String,     // user name (legacy / display)
  patient_user_id: String, // user._id for reliable lookups
  doctor_name: String,     // doctor name (display)
  doctor_user_id: String,  // doctor user._id for reliable lookups
  date: String, // format: YYYY-MM-DD
  time: String,
  status: {
    type: String,
    default: "Scheduled"
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);