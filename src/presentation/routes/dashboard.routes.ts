import express from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get complete dashboard statistics (full data)
 * @access  Private
 */
router.get("/stats", authMiddleware, DashboardController.getStats);

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get dashboard summary (lighter version)
 * @access  Private
 */
router.get("/summary", authMiddleware, DashboardController.getSummary);

/**
 * @route   GET /api/dashboard/credit-history
 * @desc    Get credit transaction history
 * @access  Private
 */
router.get(
  "/credit-history",
  authMiddleware,
  DashboardController.getCreditHistory
);

/**
 * @route   GET /api/dashboard/referral-link
 * @desc    Get referral link with share buttons
 * @access  Private
 */
router.get(
  "/referral-link",
  authMiddleware,
  DashboardController.getReferralLink
);

/**
 * @route   GET /api/dashboard/verify-integrity
 * @desc    Verify data integrity (check for double-crediting, etc.)
 * @access  Private
 */
router.get(
  "/verify-integrity",
  authMiddleware,
  DashboardController.verifyIntegrity
);

/**
 * @route   GET /api/dashboard (default route)
 * @desc    Redirect to summary
 * @access  Private
 */
router.get("/", authMiddleware, DashboardController.getSummary);

export default router;
