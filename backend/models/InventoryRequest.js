const mongoose = require("mongoose");

const inventoryRequestSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  urgency: { type: String, default: "Normal" }, // Normal | Urgent | Critical
  reason: String,
  requested_by: String,       // doctor name
  requested_by_id: String,    // doctor user _id
  status: { type: String, default: "Pending" }, // Pending | Approved | Rejected
  admin_notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("InventoryRequest", inventoryRequestSchema);
