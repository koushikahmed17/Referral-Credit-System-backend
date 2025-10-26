import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infrastructure/config/swagger";
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

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Referral & Credit System API",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "none",
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
    },
  })
);

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Root endpoint
 *     description: Basic health check and API information
 *     security: []
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Backend running successfully 🚀"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 documentation:
 *                   type: string
 *                   example: "Visit /api-docs for API documentation"
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Backend running successfully 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    documentation: "Visit /api-docs for API documentation",
  });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Detailed health check endpoint
 *     security: []
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 uptime:
 *                   type: number
 *                   description: Uptime in seconds
 *                   example: 3600
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 */
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
