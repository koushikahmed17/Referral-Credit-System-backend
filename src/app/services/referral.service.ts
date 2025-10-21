import { UserModel } from "../../domain/models/user.model";
import { ReferralModel } from "../../domain/models/referral.model";
import { ReferralStatus } from "../../domain/entities/Referral";
import {
  ReferralStats,
  ReferralResponse,
  ReferralListResponse,
  // ApplyReferralRequest,
} from "../interfaces/referral.interface";
import { logger } from "../../infrastructure/utils/logger";

export class ReferralService {
  /**
   * Generate a unique referral code for a user
   */
  static async generateReferralCode(
    userId: string,
    name?: string
  ): Promise<string> {
    try {
      // Check if user already has a referral code
      const existingUser = await UserModel.findById(userId);
      if (!existingUser) {
        throw new Error("User not found");
      }

      if (existingUser.referralCode) {
        return existingUser.referralCode;
      }

      // Generate unique referral code
      let referralCode: string = "";
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        if (name) {
          // Generate code based on name
          const namePrefix = name
            .toUpperCase()
            .replace(/[^A-Z]/g, "")
            .slice(0, 4);
          const randomSuffix = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();
          referralCode = `${namePrefix}-${randomSuffix}`;
        } else {
          // Generate random code
          const randomPart1 = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();
          const randomPart2 = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();
          referralCode = `${randomPart1}-${randomPart2}`;
        }

        // Check if code is unique
        const existingCode = await UserModel.findOne({ referralCode });
        if (!existingCode) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        throw new Error("Unable to generate unique referral code");
      }

      // Update user with referral code
      await UserModel.findByIdAndUpdate(userId, { referralCode });

      logger.info(`Generated referral code ${referralCode} for user ${userId}`);
      return referralCode;
    } catch (error) {
      logger.error("Failed to generate referral code:", error);
      throw error;
    }
  }

  /**
   * Apply a referral code when a new user registers
   */
  static async applyReferralCode(
    referralCode: string,
    newUserId: string
  ): Promise<ReferralResponse> {
    try {
      // Validate referral code
      const isValid = await this.validateReferralCode(referralCode);
      if (!isValid) {
        throw new Error("Invalid referral code");
      }

      // Find the referrer by referral code
      const referrer = await UserModel.findOne({ referralCode });
      if (!referrer) {
        throw new Error("Referral code not found");
      }

      // Check if user is trying to refer themselves
      if ((referrer._id as any).toString() === newUserId) {
        throw new Error("Cannot refer yourself");
      }

      // Check if referral relationship already exists
      const existingReferral = await ReferralModel.findOne({
        referrerId: referrer._id,
        referredUserId: newUserId,
      });

      if (existingReferral) {
        throw new Error("Referral relationship already exists");
      }

      // Create referral relationship
      const referral = new ReferralModel({
        referrerId: referrer._id,
        referredUserId: newUserId,
        status: ReferralStatus.PENDING,
        creditsEarned: 0,
      });

      await referral.save();

      // Update the referred user's record
      await UserModel.findByIdAndUpdate(newUserId, {
        referredBy: (referrer._id as any).toString(),
      });

      logger.info(
        `Applied referral code ${referralCode} for user ${newUserId} by referrer ${referrer._id}`
      );

      return {
        id: (referral._id as any).toString(),
        referrerId: referral.referrerId.toString(),
        referredUserId: referral.referredUserId.toString(),
        status: referral.status,
        creditsEarned: referral.creditsEarned,
        referralCode: referralCode,
        createdAt: referral.createdAt,
        updatedAt: referral.updatedAt,
      };
    } catch (error) {
      logger.error("Failed to apply referral code:", error);
      throw error;
    }
  }

  /**
   * Get referral statistics for a user
   */
  static async getReferralStats(userId: string): Promise<ReferralStats> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Get all referrals by this user
      const referrals = await ReferralModel.find({ referrerId: userId });

      const totalReferred = referrals.length;
      const converted = referrals.filter(
        (r) => r.status === ReferralStatus.CONFIRMED
      ).length;
      const pending = referrals.filter(
        (r) => r.status === ReferralStatus.PENDING
      ).length;

      // Calculate total credits earned from referrals
      const totalCredits = referrals.reduce(
        (sum, r) => sum + r.creditsEarned,
        0
      );

      const referralLink = `${
        process.env.CORS_ORIGIN || "http://localhost:3000"
      }/register?ref=${user.referralCode}`;

      return {
        totalReferred,
        converted,
        pending,
        totalCredits,
        referralLink,
        referralCode: user.referralCode,
      };
    } catch (error) {
      logger.error("Failed to get referral stats:", error);
      throw error;
    }
  }

  /**
   * Get paginated list of user's referrals
   */
  static async getUserReferrals(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ReferralListResponse> {
    try {
      const skip = (page - 1) * limit;

      const [referrals, total] = await Promise.all([
        ReferralModel.find({ referrerId: userId })
          .populate("referredUserId", "firstName lastName email createdAt")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ReferralModel.countDocuments({ referrerId: userId }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        referrals: referrals.map((r) => ({
          id: (r._id as any).toString(),
          referrerId: r.referrerId.toString(),
          referredUserId: r.referredUserId?.toString(),
          status: r.status,
          creditsEarned: r.creditsEarned,
          referralCode: "", // Not needed in list view
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error("Failed to get user referrals:", error);
      throw error;
    }
  }

  /**
   * Convert a pending referral to confirmed (when referred user makes first purchase)
   * Awards 2 credits to BOTH referrer and referred user
   * Uses findOneAndUpdate with status check to prevent race conditions
   */
  static async convertReferral(referralId: string): Promise<ReferralResponse> {
    try {
      // Use findOneAndUpdate with status check to prevent double-conversion
      // This is atomic and prevents race conditions
      const referral = await ReferralModel.findOneAndUpdate(
        {
          _id: referralId,
          status: ReferralStatus.PENDING, // Only update if still pending
        },
        {
          $set: {
            status: ReferralStatus.CONFIRMED,
            confirmedAt: new Date(),
            creditsEarned: 2,
          },
        },
        { new: true } // Return updated document
      );

      if (!referral) {
        throw new Error(
          "Referral not found or already processed (not in pending status)"
        );
      }

      // Award 2 credits to both users using atomic increment
      const creditsToAward = 2;

      await Promise.all([
        // Award 2 credits to the referrer (Lina)
        UserModel.findByIdAndUpdate(
          referral.referrerId,
          {
            $inc: { credits: creditsToAward },
          },
          { new: true }
        ),
        // Award 2 credits to the referred user (Ryan)
        UserModel.findByIdAndUpdate(
          referral.referredUserId,
          {
            $inc: { credits: creditsToAward },
          },
          { new: true }
        ),
      ]);

      logger.info(
        `Converted referral ${referralId}: Awarded ${creditsToAward} credits to both referrer and referred user (ATOMIC OPERATION)`
      );

      return {
        id: (referral._id as any).toString(),
        referrerId: referral.referrerId.toString(),
        referredUserId: referral.referredUserId?.toString(),
        status: referral.status,
        creditsEarned: referral.creditsEarned,
        referralCode: "",
        createdAt: referral.createdAt,
        updatedAt: referral.updatedAt,
      };
    } catch (error) {
      logger.error("Failed to convert referral:", error);
      throw error;
    }
  }

  /**
   * Convert referral by user ID (called when user makes first purchase)
   */
  static async convertReferralByUserId(
    userId: string
  ): Promise<ReferralResponse | null> {
    try {
      // Find pending referral for this user
      const referral = await ReferralModel.findOne({
        referredUserId: userId,
        status: ReferralStatus.PENDING,
      });

      if (!referral) {
        logger.debug(`No pending referral found for user ${userId}`);
        return null;
      }

      // Convert the referral
      return await this.convertReferral((referral._id as any).toString());
    } catch (error) {
      logger.error(`Failed to convert referral by user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Validate if a referral code exists and is valid
   */
  static async validateReferralCode(referralCode: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ referralCode });
      return !!user;
    } catch (error) {
      logger.error("Failed to validate referral code:", error);
      return false;
    }
  }

  /**
   * Get referral code details
   */
  static async getReferralCodeDetails(referralCode: string) {
    try {
      const user = await UserModel.findOne({ referralCode });
      if (!user) {
        throw new Error("Invalid referral code");
      }

      return {
        referrerName: `${user.firstName} ${user.lastName}`,
        referrerEmail: user.email,
        isValid: true,
      };
    } catch (error) {
      logger.error("Failed to get referral code details:", error);
      throw error;
    }
  }
}
