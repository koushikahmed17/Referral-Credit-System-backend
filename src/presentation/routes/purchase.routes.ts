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
 * @swagger
 * /api/purchases:
 *   post:
 *     tags: [Purchases]
 *     summary: Create a purchase
 *     description: Create a new purchase and automatically handle first-purchase referral rewards
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePurchaseRequest'
 *           examples:
 *             basic_purchase:
 *               summary: Basic purchase
 *               value:
 *                 amount: 99.99
 *                 description: "Premium Subscription"
 *             product_purchase:
 *               summary: Product purchase
 *               value:
 *                 amount: 49.99
 *                 description: "Digital Product - E-book"
 *     responses:
 *       201:
 *         description: Purchase created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseResponse'
 *             examples:
 *               with_referral_reward:
 *                 summary: First purchase with referral reward
 *                 value:
 *                   success: true
 *                   message: "Purchase created successfully"
 *                   data:
 *                     purchase:
 *                       _id: "507f1f77bcf86cd799439011"
 *                       userId: "507f1f77bcf86cd799439012"
 *                       amount: 99.99
 *                       description: "Premium Subscription"
 *                       status: "COMPLETED"
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                     referralReward:
 *                       awarded: true
 *                       creditsEarned: 2
 *                       message: "Congratulations! You and your referrer each earned 2 credits!"
 *               without_referral_reward:
 *                 summary: Subsequent purchase without referral reward
 *                 value:
 *                   success: true
 *                   message: "Purchase created successfully"
 *                   data:
 *                     purchase:
 *                       _id: "507f1f77bcf86cd799439011"
 *                       userId: "507f1f77bcf86cd799439012"
 *                       amount: 99.99
 *                       description: "Premium Subscription"
 *                       status: "COMPLETED"
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                     referralReward: null
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  authMiddleware,
  validate(createPurchaseSchema),
  PurchaseController.create
);

/**
 * @swagger
 * /api/purchases/stats:
 *   get:
 *     tags: [Purchases]
 *     summary: Get purchase statistics
 *     description: Get purchase statistics for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Purchase statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalPurchases:
 *                       type: number
 *                       description: Total number of purchases
 *                       example: 5
 *                     totalSpent:
 *                       type: number
 *                       description: Total amount spent
 *                       example: 499.95
 *                     averagePurchase:
 *                       type: number
 *                       description: Average purchase amount
 *                       example: 99.99
 *                     firstPurchaseDate:
 *                       type: string
 *                       format: date-time
 *                       description: Date of first purchase
 *                       example: "2024-01-15T10:30:00.000Z"
 *                     lastPurchaseDate:
 *                       type: string
 *                       format: date-time
 *                       description: Date of last purchase
 *                       example: "2024-01-20T14:30:00.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/stats", authMiddleware, PurchaseController.getStats);

/**
 * @swagger
 * /api/purchases:
 *   get:
 *     tags: [Purchases]
 *     summary: Get user purchases
 *     description: Get user's purchases with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Purchases retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Purchase'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/",
  authMiddleware,
  validateQuery(paginationSchema),
  PurchaseController.getUserPurchases
);

/**
 * @swagger
 * /api/purchases/{id}:
 *   get:
 *     tags: [Purchases]
 *     summary: Get purchase by ID
 *     description: Get a specific purchase by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Purchase retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Purchase retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Purchase'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Purchase not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:id",
  authMiddleware,
  validateParams(getPurchaseByIdSchema),
  PurchaseController.getById
);

export default router;
