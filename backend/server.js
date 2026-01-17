const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const todoRoutes = require("./routes/todoRoutes");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== API ROUTES =====
app.use("/api/todos", todoRoutes);

// ===== SERVE FRONTEND =====
app.use(express.static(path.join(__dirname, "dist")));

// IMPORTANT: React Router fallback
app.get( (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ===== START SERVER AFTER DB CONNECT =====
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌");
    console.error(err.message);
  });
