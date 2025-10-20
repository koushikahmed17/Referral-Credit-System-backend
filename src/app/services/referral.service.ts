import { UserModel } from "../../domain/models/user.model";
import { ReferralModel } from "../../domain/models/referral.model";
import { Referral } from "../../domain/entities/Referral";
import { logger } from "../../infrastructure/utils/logger";
import {
  CreateReferralDTO,
  ReferralResponse,
  ReferralStats,
} from "../interfaces/referral.interface";

export class ReferralService {
  /**
   * Apply a referral code for a new user
   */
  static async applyReferralCode(
    referralCode: string,
    userId: string
  ): Promise<ReferralResponse> {
    try {
      // Find the referrer by referral code
      const referrer = await UserModel.findOne({ referralCode });
      if (!referrer) {
        throw new Error("Invalid referral code");
      }

      if (referrer._id.toString() === userId) {
        throw new Error("Cannot refer yourself");
      }

      // Check if user is already referred
      const existingReferral = await ReferralModel.findOne({
        referredUserId: userId,
      });
      if (existingReferral) {
        throw new Error("User is already referred");
      }

      // Create referral record
      const referral = new ReferralModel({
        referrerId: referrer._id.toString(),
        referredUserId: userId,
        referralCode,
        status: "completed",
        rewardAmount: 10, // Default reward amount
      });

      await referral.save();

      // Award credits to referrer
      referrer.credits += 10;
      await referrer.save();

      // Award credits to referred user
      const referredUser = await UserModel.findById(userId);
      if (referredUser) {
        referredUser.credits += 5; // Welcome bonus
        referredUser.referredBy = referrer._id.toString();
        await referredUser.save();
      }

      logger.info(
        `Referral applied successfully: ${referralCode} for user ${userId}`
      );

      return {
        referral: {
          id: referral._id.toString(),
          referrerId: referral.referrerId,
          referredUserId: referral.referredUserId,
          referralCode: referral.referralCode,
          status: referral.status,
          rewardAmount: referral.rewardAmount,
          createdAt: referral.createdAt,
          updatedAt: referral.updatedAt,
        },
        message: "Referral applied successfully",
      };
    } catch (error) {
      logger.error("Apply referral code failed:", error);
      throw error;
    }
  }

  /**
   * Get referral statistics for a user
   */
  static async getReferralStats(userId: string): Promise<ReferralStats> {
    try {
      const referrals = await ReferralModel.find({ referrerId: userId });

      const totalReferrals = referrals.length;
      const completedReferrals = referrals.filter(
        (r) => r.status === "completed"
      ).length;
      const pendingReferrals = referrals.filter(
        (r) => r.status === "pending"
      ).length;
      const totalRewards = referrals.reduce(
        (sum, r) => sum + r.rewardAmount,
        0
      );
      const averageReward =
        totalReferrals > 0 ? totalRewards / totalReferrals : 0;

      return {
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalRewards,
        averageReward,
      };
    } catch (error) {
      logger.error("Get referral stats failed:", error);
      throw error;
    }
  }

  /**
   * Get user referrals
   */
  static async getUserReferrals(userId: string): Promise<Referral[]> {
    try {
      const referrals = await ReferralModel.find({ referrerId: userId });

      return referrals.map((referral) => ({
        id: referral._id.toString(),
        referrerId: referral.referrerId,
        referredUserId: referral.referredUserId,
        referralCode: referral.referralCode,
        status: referral.status,
        rewardAmount: referral.rewardAmount,
        createdAt: referral.createdAt,
        updatedAt: referral.updatedAt,
      }));
    } catch (error) {
      logger.error("Get user referrals failed:", error);
      throw error;
    }
  }

  /**
   * Validate referral code
   */
  static async validateReferralCode(referralCode: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ referralCode });
      return !!user;
    } catch (error) {
      logger.error("Validate referral code failed:", error);
      return false;
    }
  }
}
