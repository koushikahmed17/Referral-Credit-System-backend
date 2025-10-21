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
 * @route   POST /api/referrals/generate
 * @desc    Generate a referral code for the authenticated user
 * @access  Private
 */
router.post(
  "/generate",
  authMiddleware,
  validate(generateReferralSchema),
  ReferralController.generateReferral
);

/**
 * @route   POST /api/referrals/apply
 * @desc    Apply a referral code during registration
 * @access  Public
 */
router.post(
  "/apply",
  validate(applyReferralSchema),
  ReferralController.applyReferral
);

/**
 * @route   GET /api/referrals/stats
 * @desc    Get referral statistics for the authenticated user
 * @access  Private
 */
router.get("/stats", authMiddleware, ReferralController.getStats);

/**
 * @route   GET /api/referrals/list
 * @desc    Get paginated list of user's referrals
 * @access  Private
 */
router.get(
  "/list",
  authMiddleware,
  validateQuery(getUserReferralsSchema),
  ReferralController.getReferrals
);

/**
 * @route   GET /api/referrals/validate/:referralCode
 * @desc    Validate a referral code (authenticated users only)
 * @access  Private
 */
router.get(
  "/validate/:referralCode",
  authMiddleware,
  validateParams(validateReferralCodeSchema),
  ReferralController.validateReferralCode
);

/**
 * @route   GET /api/referrals/details/:referralCode
 * @desc    Get referral code details (public endpoint)
 * @access  Public
 */
router.get(
  "/details/:referralCode",
  validateParams(validateReferralCodeSchema),
  ReferralController.getReferralDetails
);

/**
 * @route   POST /api/referrals/convert
 * @desc    Convert a pending referral to confirmed
 * @access  Private
 */
router.post(
  "/convert",
  authMiddleware,
  validate(convertReferralSchema),
  ReferralController.convertReferral
);

export default router;
