import { PurchaseModel } from "../../domain/models/purchase.model";
import { UserModel } from "../../domain/models/user.model";
import {
  CreatePurchaseDTO,
  Purchase,
  PurchaseResponse,
  PurchaseStatus,
  PurchaseStats,
} from "../interfaces/purchase.interface";
import { ReferralService } from "./referral.service";
import { logger } from "../../infrastructure/utils/logger";

export class PurchaseService {
  /**
   * Create a new purchase
   * If this is the user's first purchase and they were referred:
   * - Award 2 credits to the referrer (Lina)
   * - Award 2 credits to the user (Ryan)
   * - Convert referral from PENDING to CONFIRMED
   */
  static async createPurchase(
    data: CreatePurchaseDTO
  ): Promise<PurchaseResponse> {
    try {
      // Check if this is user's first completed purchase
      const hasExistingPurchases = await PurchaseModel.countDocuments({
        userId: data.userId,
        status: PurchaseStatus.COMPLETED,
      });

      const isFirstPurchase = hasExistingPurchases === 0;

      // Create the purchase
      const purchase = new PurchaseModel({
        userId: data.userId,
        amount: data.amount,
        description: data.description,
        productId: data.productId,
        metadata: data.metadata,
        status: PurchaseStatus.COMPLETED,
      });

      await purchase.save();

      logger.info(
        `Purchase created for user ${data.userId}, amount: ${data.amount}`
      );

      const response: PurchaseResponse = {
        purchase: {
          id: (purchase._id as any).toString(),
          userId: purchase.userId.toString(),
          amount: purchase.amount,
          description: purchase.description,
          productId: purchase.productId,
          metadata: purchase.metadata,
          status: purchase.status,
          createdAt: purchase.createdAt,
          updatedAt: purchase.updatedAt,
        },
      };

      // If this is the first purchase, check for pending referral and convert it
      if (isFirstPurchase) {
        try {
          const referralResult = await ReferralService.convertReferralByUserId(
            data.userId
          );

          if (referralResult) {
            response.referralReward = {
              awarded: true,
              creditsEarned: 2,
              message:
                "Congratulations! You and your referrer each earned 2 credits!",
            };
            logger.info(
              `First purchase referral reward: User ${data.userId} and their referrer each earned 2 credits`
            );
          }
        } catch (referralError: any) {
          // Log error but don't fail the purchase
          logger.warn(
            `Failed to convert referral on first purchase for user ${data.userId}:`,
            referralError.message
          );
        }
      }

      return response;
    } catch (error) {
      logger.error("Create purchase failed:", error);
      throw error;
    }
  }

  /**
   * Get purchase by ID
   */
  static async getPurchaseById(purchaseId: string): Promise<Purchase> {
    try {
      const purchase = await PurchaseModel.findById(purchaseId);
      if (!purchase) {
        throw new Error("Purchase not found");
      }

      return {
        id: (purchase._id as any).toString(),
        userId: purchase.userId.toString(),
        amount: purchase.amount,
        description: purchase.description,
        productId: purchase.productId,
        metadata: purchase.metadata,
        status: purchase.status,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      };
    } catch (error) {
      logger.error("Get purchase by ID failed:", error);
      throw error;
    }
  }

  /**
   * Get user's purchases with pagination
   */
  static async getUserPurchases(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ purchases: Purchase[]; pagination: any }> {
    try {
      const skip = (page - 1) * limit;

      const [purchases, total] = await Promise.all([
        PurchaseModel.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        PurchaseModel.countDocuments({ userId }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        purchases: purchases.map((p) => ({
          id: (p._id as any).toString(),
          userId: p.userId.toString(),
          amount: p.amount,
          description: p.description,
          productId: p.productId,
          metadata: p.metadata,
          status: p.status,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error("Get user purchases failed:", error);
      throw error;
    }
  }

  /**
   * Get purchase statistics for a user
   */
  static async getPurchaseStats(userId: string): Promise<PurchaseStats> {
    try {
      const purchases = await PurchaseModel.find({ userId });

      const totalPurchases = purchases.length;
      const completedPurchases = purchases.filter(
        (p) => p.status === PurchaseStatus.COMPLETED
      ).length;
      const pendingPurchases = purchases.filter(
        (p) => p.status === PurchaseStatus.PENDING
      ).length;

      const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0);
      const averageAmount =
        totalPurchases > 0 ? totalAmount / totalPurchases : 0;

      return {
        totalPurchases,
        totalAmount,
        completedPurchases,
        pendingPurchases,
        averageAmount,
      };
    } catch (error) {
      logger.error("Get purchase stats failed:", error);
      throw error;
    }
  }
}
