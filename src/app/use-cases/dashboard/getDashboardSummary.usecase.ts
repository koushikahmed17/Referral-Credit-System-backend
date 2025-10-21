// Get dashboard summary use case
import { DashboardService } from "../../services/dashboard.service";
import { DashboardSummary } from "../../interfaces/dashboard.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const getDashboardSummaryUseCase = async (
  userId: string
): Promise<DashboardSummary> => {
  try {
    logger.debug(`Getting dashboard summary for user ${userId}`);

    if (!userId) {
      throw new Error("User ID is required");
    }

    const summary = await DashboardService.getDashboardSummary(userId);

    logger.debug(`Successfully retrieved dashboard summary for user ${userId}`);
    return summary;
  } catch (error) {
    logger.error(`Failed to get dashboard summary for user ${userId}:`, error);
    throw error;
  }
};
