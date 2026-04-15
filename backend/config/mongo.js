// backend/config/mongo.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      console.error("❌ MONGO_URI is not set in environment variables!");
      return; // Don't crash — let server start so Azure health checks pass
    }

    console.log("🔄 Connecting to MongoDB/Cosmos DB...");

    // Cosmos DB-compatible connection options
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,  // 30 sec timeout
      socketTimeoutMS: 45000,           // 45 sec socket timeout
      retryWrites: false,               // Cosmos DB doesn't support retryWrites
      maxPoolSize: 10,
    });

    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("Full error:", err);
    // DON'T process.exit(1) — let the server stay alive for Azure health checks
    // The server will return 500 errors on DB operations, but won't crash
  }
};

module.exports = connectDB;