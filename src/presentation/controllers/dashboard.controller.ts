import { Request, Response } from "express";
import { getDashboardStatsUseCase } from "../../app/use-cases/dashboard/getDashboardStats.usecase";
import { getDashboardSummaryUseCase } from "../../app/use-cases/dashboard/getDashboardSummary.usecase";
import { getCreditHistoryUseCase } from "../../app/use-cases/dashboard/getCreditHistory.usecase";
import { verifyDataIntegrityUseCase } from "../../app/use-cases/dashboard/verifyDataIntegrity.usecase";
import { logger } from "../../infrastructure/utils/logger";

export const DashboardController = {
  /**
   * Get complete dashboard statistics
   * Includes all user data, referrals, and purchases
   */
  getStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      const stats = await getDashboardStatsUseCase(userId);

      res.status(200).json({
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      logger.error("Get dashboard stats controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to get dashboard stats",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get dashboard summary (lighter version)
   * Better for mobile or quick overview
   */
  getSummary: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      const summary = await getDashboardSummaryUseCase(userId);

      res.status(200).json({
        success: true,
        message: "Dashboard summary retrieved successfully",
        data: summary,
      });
    } catch (error: any) {
      logger.error("Get dashboard summary controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to get dashboard summary",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get credit history
   * Shows all credit transactions with sources
   */
  getCreditHistory: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      const history = await getCreditHistoryUseCase(userId);

      res.status(200).json({
        success: true,
        message: "Credit history retrieved successfully",
        data: history,
      });
    } catch (error: any) {
      logger.error("Get credit history controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to get credit history",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Verify data integrity
   * Admin/debug endpoint to check for inconsistencies
   */
  verifyIntegrity: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      const result = await verifyDataIntegrityUseCase(userId);

      res.status(200).json({
        success: true,
        message: result.isValid
          ? "Data integrity verified"
          : "Data integrity issues found",
        data: result,
      });
    } catch (error: any) {
      logger.error("Verify data integrity controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to verify data integrity",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get referral link info
   * Returns shareable referral link and code
   */
  getReferralLink: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;

      const baseUrl = process.env.CORS_ORIGIN || "http://localhost:3000";
      const referralLink = `${baseUrl}/register?ref=${user.user.referralCode}`;

      res.status(200).json({
        success: true,
        message: "Referral link retrieved successfully",
        data: {
          referralCode: user.user.referralCode,
          referralLink,
          shareableMessage: `Join using my referral code: ${user.user.referralCode} and we both earn credits! ${referralLink}`,
          socialShare: {
            twitter: `https://twitter.com/intent/tweet?text=Join%20using%20my%20referral%20code%20${
              user.user.referralCode
            }%20and%20we%20both%20earn%20credits!&url=${encodeURIComponent(
              referralLink
            )}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              referralLink
            )}`,
            whatsapp: `https://wa.me/?text=Join%20using%20my%20referral%20code%20${user.user.referralCode}%20and%20we%20both%20earn%20credits!%20${referralLink}`,
            email: `mailto:?subject=Join and earn credits&body=Join using my referral code: ${user.user.referralCode} and we both earn credits! ${referralLink}`,
          },
        },
      });
    } catch (error: any) {
      logger.error("Get referral link controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to get referral link",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },
};
