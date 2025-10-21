// Get user purchases use case
import { PurchaseService } from "../../services/purchase.service";
import { Purchase } from "../../interfaces/purchase.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const getUserPurchasesUseCase = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ purchases: Purchase[]; pagination: any }> => {
  try {
    logger.debug(
      `Getting purchases for user ${userId}, page ${page}, limit ${limit}`
    );

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit));

    const result = await PurchaseService.getUserPurchases(
      userId,
      validPage,
      validLimit
    );

    logger.debug(`Successfully retrieved purchases for user ${userId}`);
    return result;
  } catch (error) {
    logger.error(`Failed to get purchases for user ${userId}:`, error);
    throw error;
  }
};
