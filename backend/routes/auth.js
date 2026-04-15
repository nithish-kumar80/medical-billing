const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log("📝 Register request:", req.body);
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User registered" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ msg: "Error registering", error: err.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("🔐 LOGIN REQUEST BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing fields — email:", email, "password:", password);
      return res.status(400).json({ msg: "Email & Password required" });
    }

    // Check if mongoose is connected
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB is not connected! State:", mongoose.connection.readyState);
      return res.status(503).json({ msg: "Database not connected. Please try again later." });
    }

    const user = await User.findOne({ email });

    console.log("👤 USER FROM DB:", user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("🔑 DB PASSWORD:", user.password);
    console.log("🔑 ENTERED PASSWORD:", password);

    if (user.password !== password) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    res.json({
      msg: "Login success",
      user
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ GET ALL DOCTORS
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    console.error("❌ ERROR FETCHING DOCTORS:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;