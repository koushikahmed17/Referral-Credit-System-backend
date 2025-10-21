import { Request, Response } from "express";
import { createReferralUseCase } from "../../app/use-cases/referral/createReferral.usecase";
import { getReferralStatsUseCase } from "../../app/use-cases/referral/getReferralStats.usecase";
import { getUserReferralsUseCase } from "../../app/use-cases/referral/getUserReferrals.usecase";
import { validateReferralCodeUseCase } from "../../app/use-cases/referral/validateReferralCode.usecase";
import { applyReferralUseCase } from "../../app/use-cases/referral/applyReferral.usecase";
import { convertReferralUseCase } from "../../app/use-cases/referral/convertReferral.usecase";
import { logger } from "../../infrastructure/utils/logger";

export const ReferralController = {
  /**
   * Generate a referral code for the authenticated user
   */
  generateReferral: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const userId = (req as any).user.userId;

      const referralCode = await createReferralUseCase(userId, name);

      res.status(201).json({
        success: true,
        message: "Referral code generated successfully",
        data: {
          referralCode,
          referralLink: `${
            process.env.CORS_ORIGIN || "http://localhost:3000"
          }/register?ref=${referralCode}`,
        },
      });
    } catch (error: any) {
      logger.error("Generate referral controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to generate referral code",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Apply a referral code
   */
  applyReferral: async (req: Request, res: Response): Promise<void> => {
    try {
      const { referralCode } = req.body;
      const userId = (req as any).user.userId;

      const result = await applyReferralUseCase(referralCode, userId);

      res.status(200).json({
        success: true,
        message: "Referral code applied successfully",
        data: result,
      });
    } catch (error: any) {
      logger.error("Apply referral controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to apply referral code",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Convert a pending referral to confirmed
   */
  convertReferral: async (req: Request, res: Response): Promise<void> => {
    try {
      const { referralId } = req.params;

      const result = await convertReferralUseCase(referralId);

      res.status(200).json({
        success: true,
        message: "Referral converted successfully",
        data: result,
      });
    } catch (error: any) {
      logger.error("Convert referral controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to convert referral",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get referral statistics for the authenticated user
   */
  getStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      const stats = await getReferralStatsUseCase(userId);

      res.status(200).json({
        success: true,
        message: "Referral stats retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      logger.error("Get referral stats controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to get referral stats",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get paginated list of user's referrals
   */
  getReferrals: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const referrals = await getUserReferralsUseCase(userId, page, limit);

      res.status(200).json({
        success: true,
        message: "Referrals retrieved successfully",
        data: referrals,
      });
    } catch (error: any) {
      logger.error("Get referrals controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to get referrals",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Validate a referral code
   */
  validateReferralCode: async (req: Request, res: Response): Promise<void> => {
    try {
      const { referralCode } = req.params;

      const details = await validateReferralCodeUseCase(referralCode);

      res.status(200).json({
        success: true,
        message: "Referral code validated successfully",
        data: details,
      });
    } catch (error: any) {
      logger.error("Validate referral code controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Invalid referral code",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get referral code details (public endpoint)
   */
  getReferralDetails: async (req: Request, res: Response): Promise<void> => {
    try {
      const { referralCode } = req.params;

      const details = await validateReferralCodeUseCase(referralCode);

      res.status(200).json({
        success: true,
        message: "Referral code details retrieved successfully",
        data: details,
      });
    } catch (error: any) {
      logger.error("Get referral details controller error:", error);

      res.status(404).json({
        success: false,
        message: error.message || "Referral code not found",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },
};
