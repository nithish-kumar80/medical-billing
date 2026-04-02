require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/mongo");
const patientRoutes = require("./routes/patientRoutes"); // routes file

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use("/api", patientRoutes); // All routes prefixed with /api

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});