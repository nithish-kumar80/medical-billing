require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/mongo");
const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/auth");

const app = express();

/**
 * ✅ Allowed origins (LOCAL + AZURE FRONTEND)
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://icy-field-09ddac300.6.azurestaticapps.net",
  "https://icy-field-09ddac300.azurestaticapps.net",
  process.env.FRONTEND_URL // MUST be set in Azure
].filter(Boolean);

/**
 * ✅ CORS CONFIGURATION (Production Ready)
 */
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests without origin (Postman, mobile apps, health checks)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ CORS blocked origin:", origin);
    console.log("✅ Allowed origins:", allowedOrigins);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// 🔥 Apply CORS middleware FIRST
app.use(cors(corsOptions));

// 🔥 Handle preflight requests (VERY IMPORTANT)
app.options("*", cors(corsOptions));

/**
 * 🔥 EXTRA SAFETY (Azure sometimes strips headers)
 */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
});

// Middleware — parse JSON body
app.use(express.json());

/**
 * ✅ Health check routes (important for Azure)
 */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Medical Billing API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * ✅ API Routes
 */
app.use("/api", patientRoutes);
app.use("/api", authRoutes);

/**
 * ✅ Start Server (Azure uses PORT automatically)
 * Connect to DB first, THEN start listening.
 */
const PORT = process.env.PORT || 8080;

async function startServer() {
  // Connect to MongoDB (won't crash if it fails)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("✅ Allowed Origins:", allowedOrigins);
    console.log("✅ Environment:", process.env.NODE_ENV || "development");
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
});