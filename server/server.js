import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";


const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "smart-agriculture-server"
  });
});


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/predictions", predictionRoutes);

app.use("/api/weather", weatherRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/email", emailRoutes);

// Server
const PORT = process.env.PORT || 5000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch(error => {
    console.error(
      "Database connection failed:",
      error.message
    );

    process.exit(1);
  });