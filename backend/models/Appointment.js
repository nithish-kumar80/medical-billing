const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patient_id: String,
  doctor_name: String,
  date: String,
  time: String,
  status: {
    type: String,
    default: "Scheduled"
  }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);