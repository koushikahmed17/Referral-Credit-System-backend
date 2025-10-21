// Get purchase stats use case
import { PurchaseService } from "../../services/purchase.service";
import { PurchaseStats } from "../../interfaces/purchase.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const getPurchaseStatsUseCase = async (
  userId: string
): Promise<PurchaseStats> => {
  try {
    logger.debug(`Getting purchase stats for user ${userId}`);

    if (!userId) {
      throw new Error("User ID is required");
    }

    const stats = await PurchaseService.getPurchaseStats(userId);

    logger.debug(`Successfully retrieved purchase stats for user ${userId}`);
    return stats;
  } catch (error) {
    logger.error(`Failed to get purchase stats for user ${userId}:`, error);
    throw error;
  }
};
