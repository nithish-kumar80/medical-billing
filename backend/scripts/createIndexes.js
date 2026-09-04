/**
 * createIndexes.js — Run once after deployment on Cosmos DB / MongoDB
 * Usage: node backend/scripts/createIndexes.js
 *
 * Creates the text indexes required for ICD/CPT full-text search.
 * On Atlas / local MongoDB this is automatic from the schema definition,
 * but Azure Cosmos DB for MongoDB API requires explicit index creation.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");

async function createIndexes() {
  try {
    console.log("🔗 Connecting…");
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    // ICD codes — text index on code + description
    await db.collection("icdcodes").createIndex(
      { code: "text", description: "text" },
      { name: "icdcodes_text" }
    );
    console.log("✅ IcdCode text index created.");

    // CPT/HCPCS codes — text index on code + description
    await db.collection("cptcodes").createIndex(
      { code: "text", description: "text" },
      { name: "cptcodes_text" }
    );
    console.log("✅ CptCode text index created.");

    // InsurancePolicy — index on patient for fast lookup
    await db.collection("insurancepolicies").createIndex(
      { patient: 1 },
      { name: "insurancepolicies_patient" }
    );
    console.log("✅ InsurancePolicy patient index created.");

    console.log("🎉 All indexes created.");
  } catch (err) {
    console.error("❌ Index creation failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

createIndexes();
