import { UserModel } from "../../domain/models/user.model";
import { ReferralModel } from "../../domain/models/referral.model";
import { PurchaseModel } from "../../domain/models/purchase.model";
import { ReferralStatus } from "../../domain/entities/Referral";
import { PurchaseStatus } from "../interfaces/purchase.interface";
import {
  DashboardStats,
  DashboardSummary,
  RecentReferral,
  RecentPurchase,
} from "../interfaces/dashboard.interface";
import { logger } from "../../infrastructure/utils/logger";

export class DashboardService {
  /**
   * Get complete dashboard statistics for a user
   * Includes all referral and purchase data with data integrity
   */
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // Use Promise.all for concurrent queries (better performance)
      const [user, referrals, purchases] = await Promise.all([
        UserModel.findById(userId),
        ReferralModel.find({ referrerId: userId })
          .populate("referredUserId", "firstName lastName email")
          .sort({ createdAt: -1 })
          .limit(10),
        PurchaseModel.find({ userId }).sort({ createdAt: -1 }).limit(10),
      ]);

      if (!user) {
        throw new Error("User not found");
      }

      // Calculate stats
      const totalReferredUsers = referrals.length;
      const referredUsersWhoPurchased = referrals.filter(
        (r) => r.status === ReferralStatus.CONFIRMED
      ).length;

      // Calculate total credits earned from referrals only
      const totalCreditsEarned = referrals.reduce(
        (sum, r) => sum + r.creditsEarned,
        0
      );

      // Generate referral link
      const baseUrl = process.env.CORS_ORIGIN || "http://localhost:3000";
      const referralLink = `${baseUrl}/register?ref=${user.referralCode}`;

      // Map recent referrals
      const recentReferrals: RecentReferral[] = referrals.map((r) => ({
        id: (r._id as any).toString(),
        referredUserName: r.referredUserId
          ? `${(r.referredUserId as any).firstName} ${
              (r.referredUserId as any).lastName
            }`
          : "Unknown User",
        status: r.status,
        creditsEarned: r.creditsEarned,
        createdAt: r.createdAt,
      }));

      // Map recent purchases
      const recentPurchases: RecentPurchase[] = purchases.map((p) => ({
        id: (p._id as any).toString(),
        amount: p.amount,
        description: p.description,
        status: p.status,
        createdAt: p.createdAt,
      }));

      return {
        totalReferredUsers,
        referredUsersWhoPurchased,
        totalCreditsEarned,
        referralLink,
        referralCode: user.referralCode,
        userInfo: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          totalCredits: user.credits,
          joinedDate: user.createdAt,
        },
        recentReferrals,
        recentPurchases,
      };
    } catch (error) {
      logger.error("Failed to get dashboard stats:", error);
      throw error;
    }
  }

  /**
   * Get dashboard summary (lighter version)
   */
  static async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    try {
      const [user, referralStats, recentActivity] = await Promise.all([
        UserModel.findById(userId),
        ReferralModel.aggregate([
          { $match: { referrerId: userId } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              confirmed: {
                $sum: {
                  $cond: [{ $eq: ["$status", ReferralStatus.CONFIRMED] }, 1, 0],
                },
              },
              pending: {
                $sum: {
                  $cond: [{ $eq: ["$status", ReferralStatus.PENDING] }, 1, 0],
                },
              },
              totalCredits: { $sum: "$creditsEarned" },
            },
          },
        ]),
        Promise.all([
          ReferralModel.find({ referrerId: userId })
            .populate("referredUserId", "firstName lastName")
            .sort({ createdAt: -1 })
            .limit(5),
          PurchaseModel.find({ userId }).sort({ createdAt: -1 }).limit(5),
        ]),
      ]);

      if (!user) {
        throw new Error("User not found");
      }

      const stats = referralStats[0] || {
        total: 0,
        confirmed: 0,
        pending: 0,
        totalCredits: 0,
      };

      const [recentReferrals, recentPurchases] = recentActivity;

      const baseUrl = process.env.CORS_ORIGIN || "http://localhost:3000";
      const referralLink = `${baseUrl}/register?ref=${user.referralCode}`;

      return {
        overview: {
          totalReferredUsers: stats.total,
          referredUsersWhoPurchased: stats.confirmed,
          pendingReferrals: stats.pending,
          totalCreditsEarned: stats.totalCredits,
        },
        referralInfo: {
          referralCode: user.referralCode,
          referralLink,
          shareableMessage: `Join using my referral code: ${user.referralCode} and we both earn credits! ${referralLink}`,
        },
        activity: {
          recentReferrals: recentReferrals.map((r) => ({
            id: (r._id as any).toString(),
            referredUserName: r.referredUserId
              ? `${(r.referredUserId as any).firstName} ${
                  (r.referredUserId as any).lastName
                }`
              : "Unknown User",
            status: r.status,
            creditsEarned: r.creditsEarned,
            createdAt: r.createdAt,
          })),
          recentPurchases: recentPurchases.map((p) => ({
            id: (p._id as any).toString(),
            amount: p.amount,
            description: p.description,
            status: p.status,
            createdAt: p.createdAt,
          })),
        },
      };
    } catch (error) {
      logger.error("Failed to get dashboard summary:", error);
      throw error;
    }
  }

  /**
   * Get user's credit history with source tracking
   * Shows where credits came from (referrals vs other sources)
   */
  static async getCreditHistory(userId: string): Promise<any> {
    try {
      const [user, referralCredits] = await Promise.all([
        UserModel.findById(userId),
        ReferralModel.find({
          $or: [{ referrerId: userId }, { referredUserId: userId }],
          status: ReferralStatus.CONFIRMED,
        }).sort({ confirmedAt: -1 }),
      ]);

      if (!user) {
        throw new Error("User not found");
      }

      const creditHistory = referralCredits.map((r) => ({
        source:
          r.referrerId.toString() === userId
            ? "referral_reward"
            : "signup_bonus",
        amount: r.creditsEarned,
        description:
          r.referrerId.toString() === userId
            ? "Earned from referring a user"
            : "Earned as a signup bonus",
        date: r.confirmedAt || r.createdAt,
        referralId: (r._id as any).toString(),
      }));

      return {
        currentBalance: user.credits,
        totalEarned: creditHistory.reduce((sum, c) => sum + c.amount, 0),
        history: creditHistory,
      };
    } catch (error) {
      logger.error("Failed to get credit history:", error);
      throw error;
    }
  }

  /**
   * Verify data integrity - check for any inconsistencies
   */
  static async verifyDataIntegrity(userId: string): Promise<any> {
    try {
      const [user, referrals, purchases] = await Promise.all([
        UserModel.findById(userId),
        ReferralModel.find({ referrerId: userId }),
        PurchaseModel.find({ userId }),
      ]);

      if (!user) {
        throw new Error("User not found");
      }

      // Calculate expected credits from referrals
      const expectedCreditsFromReferrals = referrals
        .filter((r) => r.status === ReferralStatus.CONFIRMED)
        .reduce((sum, r) => sum + r.creditsEarned, 0);

      // Check for duplicate referrals
      const referredUserIds = referrals.map((r) => r.referredUserId.toString());
      const uniqueReferredUsers = new Set(referredUserIds);
      const hasDuplicates = referredUserIds.length !== uniqueReferredUsers.size;

      // Check for referrals without purchases
      const confirmedReferrals = referrals.filter(
        (r) => r.status === ReferralStatus.CONFIRMED
      );
      const purchaseUserIds = new Set(
        purchases
          .filter((p) => p.status === PurchaseStatus.COMPLETED)
          .map((p) => p.userId.toString())
      );

      const issues: string[] = [];

      if (hasDuplicates) {
        issues.push("Duplicate referral relationships detected");
      }

      // Verify each confirmed referral has a purchase
      for (const referral of confirmedReferrals) {
        const hashedPurchase = await PurchaseModel.findOne({
          userId: referral.referredUserId,
          status: PurchaseStatus.COMPLETED,
        });
        if (!hashedPurchase) {
          issues.push(
            `Confirmed referral ${referral._id} has no associated purchase`
          );
        }
      }

      return {
        isValid: issues.length === 0,
        currentCredits: user.credits,
        expectedCreditsFromReferrals,
        issues,
        stats: {
          totalReferrals: referrals.length,
          confirmedReferrals: confirmedReferrals.length,
          totalPurchases: purchases.length,
          completedPurchases: purchases.filter(
            (p) => p.status === PurchaseStatus.COMPLETED
          ).length,
        },
      };
    } catch (error) {
      logger.error("Failed to verify data integrity:", error);
      throw error;
    }
  }
}
