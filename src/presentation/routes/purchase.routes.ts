import express from "express";
import { PurchaseController } from "../controllers/purchase.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  validate,
  validateQuery,
  validateParams,
} from "../middlewares/validate.middleware";
import {
  createPurchaseSchema,
  getPurchaseByIdSchema,
  paginationSchema,
} from "../../app/validations/purchase.validation";

const router = express.Router();

/**
 * @route   POST /api/purchases
 * @desc    Create a new purchase (automatically handles first-purchase referral rewards)
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  validate(createPurchaseSchema),
  PurchaseController.create
);

/**
 * @route   GET /api/purchases/stats
 * @desc    Get purchase statistics for the authenticated user
 * @access  Private
 */
router.get("/stats", authMiddleware, PurchaseController.getStats);

/**
 * @route   GET /api/purchases
 * @desc    Get user's purchases with pagination
 * @access  Private
 */
router.get(
  "/",
  authMiddleware,
  validateQuery(paginationSchema),
  PurchaseController.getUserPurchases
);

/**
 * @route   GET /api/purchases/:id
 * @desc    Get purchase by ID
 * @access  Private
 */
router.get(
  "/:id",
  authMiddleware,
  validateParams(getPurchaseByIdSchema),
  PurchaseController.getById
);

export default router;
