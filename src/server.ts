import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./presentation/routes/auth.routes";
import referralRoutes from "./presentation/routes/referral.routes";
import purchaseRoutes from "./presentation/routes/purchase.routes";
import dashboardRoutes from "./presentation/routes/dashboard.routes";
import {
  errorHandler,
  notFoundHandler,
} from "./presentation/middlewares/error.middleware";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Backend running successfully 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Referral routes
app.use("/api/referrals", referralRoutes);

// Purchase routes
app.use("/api/purchases", purchaseRoutes);

// Dashboard routes
app.use("/api/dashboard", dashboardRoutes);

// 404 handler - must be before error handler
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

export default app;
