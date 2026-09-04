const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"]
  },

  // ===== NEW OPTIONAL SUB-OBJECT (additive — existing users unaffected) =====
  doctorDetails: {
    npi:      { type: String, match: /^\d{10}$/ },
    specialty: String,
    practices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Practice" }]
  }
});

module.exports = mongoose.model("User", userSchema);