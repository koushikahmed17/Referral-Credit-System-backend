import express from "express";
import { ReferralController } from "../controllers/referral.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  validate,
  validateQuery,
  validateParams,
} from "../middlewares/validate.middleware";
import {
  generateReferralSchema,
  applyReferralSchema,
  validateReferralCodeSchema,
  getUserReferralsSchema,
  convertReferralSchema,
} from "../../app/validations/referral.validation";

const router = express.Router();

/**
 * @swagger
 * /api/referrals/generate:
 *   post:
 *     tags: [Referrals]
 *     summary: Generate referral code
 *     description: Generate a new referral code for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customCode:
 *                 type: string
 *                 description: Optional custom referral code
 *                 example: "MYCODE123"
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Referral code generated successfully
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
 *                   example: "Referral code generated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     referralCode:
 *                       type: string
 *                       example: "JOHN123"
 *                     referralLink:
 *                       type: string
 *                       example: "https://yourapp.com/register?ref=JOHN123"
 *       400:
 *         description: Validation error or code already exists
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
  "/generate",
  authMiddleware,
  validate(generateReferralSchema),
  ReferralController.generateReferral
);

/**
 * @swagger
 * /api/referrals/apply:
 *   post:
 *     tags: [Referrals]
 *     summary: Apply referral code
 *     description: Apply a referral code during user registration
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referralCode:
 *                 type: string
 *                 description: Referral code to apply
 *                 example: "LINA123"
 *               userId:
 *                 type: string
 *                 description: ID of the user applying the referral
 *                 example: "507f1f77bcf86cd799439011"
 *             required: [referralCode, userId]
 *     responses:
 *       200:
 *         description: Referral code applied successfully
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
 *                   example: "Referral code applied successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Referral'
 *       400:
 *         description: Validation error or invalid referral code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Referral code not found
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
  "/apply",
  validate(applyReferralSchema),
  ReferralController.applyReferral
);

/**
 * @swagger
 * /api/referrals/stats:
 *   get:
 *     tags: [Referrals]
 *     summary: Get referral statistics
 *     description: Get referral statistics for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral statistics retrieved successfully
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
 *                   example: "Referral statistics retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ReferralStats'
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
router.get("/stats", authMiddleware, ReferralController.getStats);

/**
 * @swagger
 * /api/referrals/list:
 *   get:
 *     tags: [Referrals]
 *     summary: Get user referrals
 *     description: Get paginated list of referrals made by the authenticated user
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
 *         description: Referrals retrieved successfully
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
 *                         $ref: '#/components/schemas/Referral'
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
  "/list",
  authMiddleware,
  validateQuery(getUserReferralsSchema),
  ReferralController.getReferrals
);

/**
 * @swagger
 * /api/referrals/validate/{referralCode}:
 *   get:
 *     tags: [Referrals]
 *     summary: Validate referral code
 *     description: Validate a referral code (authenticated users only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: referralCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Referral code to validate
 *         example: "LINA123"
 *     responses:
 *       200:
 *         description: Referral code validation result
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
 *                   example: "Referral code is valid"
 *                 data:
 *                   type: object
 *                   properties:
 *                     valid:
 *                       type: boolean
 *                       example: true
 *                     referralCode:
 *                       type: string
 *                       example: "LINA123"
 *                     referrer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "507f1f77bcf86cd799439011"
 *                         firstName:
 *                           type: string
 *                           example: "Lina"
 *                         lastName:
 *                           type: string
 *                           example: "Smith"
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
 *         description: Referral code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/validate/:referralCode",
  authMiddleware,
  validateParams(validateReferralCodeSchema),
  ReferralController.validateReferralCode
);

/**
 * @swagger
 * /api/referrals/details/{referralCode}:
 *   get:
 *     tags: [Referrals]
 *     summary: Get referral code details
 *     description: Get referral code details (public endpoint)
 *     security: []
 *     parameters:
 *       - in: path
 *         name: referralCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Referral code to get details for
 *         example: "LINA123"
 *     responses:
 *       200:
 *         description: Referral code details retrieved successfully
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
 *                   example: "Referral code details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     referralCode:
 *                       type: string
 *                       example: "LINA123"
 *                     referrer:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: "Lina"
 *                         lastName:
 *                           type: string
 *                           example: "Smith"
 *                     referralLink:
 *                       type: string
 *                       example: "https://yourapp.com/register?ref=LINA123"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Referral code not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/details/:referralCode",
  validateParams(validateReferralCodeSchema),
  ReferralController.getReferralDetails
);

/**
 * @swagger
 * /api/referrals/convert:
 *   post:
 *     tags: [Referrals]
 *     summary: Convert referral
 *     description: Convert a pending referral to confirmed status
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referralId:
 *                 type: string
 *                 description: ID of the referral to convert
 *                 example: "507f1f77bcf86cd799439011"
 *             required: [referralId]
 *     responses:
 *       200:
 *         description: Referral converted successfully
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
 *                   example: "Referral converted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Referral'
 *       400:
 *         description: Validation error or referral already processed
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
 *         description: Referral not found
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
  "/convert",
  authMiddleware,
  validate(convertReferralSchema),
  ReferralController.convertReferral
);

export default router;
