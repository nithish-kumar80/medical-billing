const mongoose = require("mongoose");

const PayerSchema = new mongoose.Schema({
  payerName: { type: String, required: true },
  payerType: {
    type: String,
    enum: ["commercial", "medicare", "medicaid", "self_pay", "other"],
    default: "commercial"
  },
  electronicPayerId: String,
  claimsAddress: {
    line1: String,
    city:  String,
    state: String,
    zip:   String
  },
  phone: String,
  timelyFilingLimitDays: { type: Number, default: 90 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Payer", PayerSchema);
