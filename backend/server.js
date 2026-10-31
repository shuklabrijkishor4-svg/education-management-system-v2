// ============================================================
// server.js - starting point of the backend (Express server)
// ============================================================
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config(); // reads values from the .env file

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const enquiryRoutes = require("./routes/enquiryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const seedData = require("./seedData");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DB_HOST
  ? "mongodb+srv://" +
    encodeURIComponent(process.env.DB_USER) + ":" +
    encodeURIComponent(process.env.DB_PASS) + "@" +
    process.env.DB_HOST + "/" + process.env.DB_NAME +
    "?retryWrites=true&w=majority"
  : process.env.MONGO_URI || "mongodb://127.0.0.1:27017/education_management";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// The login system cannot work without a secret key
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Add it to backend/.env (see README.md).");
  process.exit(1);
}

// ---------- Middleware ----------
// CORS lets the React site (port 5173) talk to this server (port 5000)
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
// Lets Express read JSON sent by the frontend
app.use(express.json());

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.json({ success: true, message: "Education API is running." });
});
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notices", noticeRoutes);

// ---------- Unknown URL (404) ----------
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ---------- Error handler (catches unexpected errors) ----------
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  // Bad JSON sent by the client
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON data." });
  }
  res.status(500).json({ success: false, message: "Something went wrong on the server." });
});

// ---------- Connect to local MongoDB, add starter data, start the server ----------
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected.");
    await seedData(); // first admin + starter courses (only if empty)
    app.listen(PORT, () => {
      console.log("Server running at http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.error("Could not start the server:", error.message);
    process.exit(1);
  });
