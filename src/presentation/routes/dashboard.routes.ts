import express from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get complete dashboard statistics
 *     description: Get comprehensive dashboard statistics including referrals, purchases, and credits
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
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
 *                   example: "Dashboard statistics retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
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
router.get("/stats", authMiddleware, DashboardController.getStats);

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard summary
 *     description: Get a lighter version of dashboard data for quick overview
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
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
 *                   example: "Dashboard summary retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalReferrals:
 *                       type: number
 *                       example: 10
 *                     confirmedReferrals:
 *                       type: number
 *                       example: 7
 *                     totalCredits:
 *                       type: number
 *                       example: 25
 *                     totalPurchases:
 *                       type: number
 *                       example: 5
 *                     referralLink:
 *                       type: string
 *                       example: "https://yourapp.com/register?ref=JOHN123"
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
router.get("/summary", authMiddleware, DashboardController.getSummary);

/**
 * @swagger
 * /api/dashboard/credit-history:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get credit history
 *     description: Get credit transaction history for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credit history retrieved successfully
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
 *                   example: "Credit history retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [REFERRAL_EARNED, PURCHASE_MADE, MANUAL_ADJUSTMENT]
 *                         example: "REFERRAL_EARNED"
 *                       amount:
 *                         type: number
 *                         example: 2
 *                       description:
 *                         type: string
 *                         example: "Earned from referral conversion"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00.000Z"
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
router.get(
  "/credit-history",
  authMiddleware,
  DashboardController.getCreditHistory
);

/**
 * @swagger
 * /api/dashboard/referral-link:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get referral link
 *     description: Get referral link with share options for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral link retrieved successfully
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
 *                   example: "Referral link retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     referralCode:
 *                       type: string
 *                       example: "JOHN123"
 *                     referralLink:
 *                       type: string
 *                       example: "https://yourapp.com/register?ref=JOHN123"
 *                     shareOptions:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           example: "mailto:?subject=Join me on this app&body=Check out this app: https://yourapp.com/register?ref=JOHN123"
 *                         twitter:
 *                           type: string
 *                           example: "https://twitter.com/intent/tweet?text=Check out this app: https://yourapp.com/register?ref=JOHN123"
 *                         facebook:
 *                           type: string
 *                           example: "https://www.facebook.com/sharer/sharer.php?u=https://yourapp.com/register?ref=JOHN123"
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
router.get(
  "/referral-link",
  authMiddleware,
  DashboardController.getReferralLink
);

/**
 * @swagger
 * /api/dashboard/verify-integrity:
 *   get:
 *     tags: [Dashboard]
 *     summary: Verify data integrity
 *     description: Verify data integrity and check for issues like double-crediting
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data integrity verification completed
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
 *                   example: "Data integrity verification completed"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isIntegrityValid:
 *                       type: boolean
 *                       example: true
 *                     issues:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     checks:
 *                       type: object
 *                       properties:
 *                         doubleCrediting:
 *                           type: boolean
 *                           example: false
 *                         orphanedReferrals:
 *                           type: boolean
 *                           example: false
 *                         creditBalanceConsistency:
 *                           type: boolean
 *                           example: true
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
router.get(
  "/verify-integrity",
  authMiddleware,
  DashboardController.verifyIntegrity
);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard (default)
 *     description: Default dashboard endpoint that redirects to summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
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
 *                   example: "Dashboard summary retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalReferrals:
 *                       type: number
 *                       example: 10
 *                     confirmedReferrals:
 *                       type: number
 *                       example: 7
 *                     totalCredits:
 *                       type: number
 *                       example: 25
 *                     totalPurchases:
 *                       type: number
 *                       example: 5
 *                     referralLink:
 *                       type: string
 *                       example: "https://yourapp.com/register?ref=JOHN123"
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
router.get("/", authMiddleware, DashboardController.getSummary);

export default router;
