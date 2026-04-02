// backend/config/mongo.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI); // debug
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB Error ❌", err);
    process.exit(1);
  }
};

module.exports = connectDB; // ✅ export the function correctly