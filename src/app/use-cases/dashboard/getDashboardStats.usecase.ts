// Get dashboard stats use case
import { DashboardService } from "../../services/dashboard.service";
import { DashboardStats } from "../../interfaces/dashboard.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const getDashboardStatsUseCase = async (
  userId: string
): Promise<DashboardStats> => {
  try {
    logger.debug(`Getting dashboard stats for user ${userId}`);

    if (!userId) {
      throw new Error("User ID is required");
    }

    const stats = await DashboardService.getDashboardStats(userId);

    logger.debug(`Successfully retrieved dashboard stats for user ${userId}`);
    return stats;
  } catch (error) {
    logger.error(`Failed to get dashboard stats for user ${userId}:`, error);
    throw error;
  }
};
