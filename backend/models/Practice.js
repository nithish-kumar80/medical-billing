const mongoose = require("mongoose");

const PracticeSchema = new mongoose.Schema({
  name:  { type: String, required: true }, // e.g. "City Hospital"
  npi:   { type: String, match: /^\d{10}$/ },
  taxId: String,
  address: {
    line1: String,
    city:  String,
    state: String,
    zip:   String
  },
  phone: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Practice", PracticeSchema);
