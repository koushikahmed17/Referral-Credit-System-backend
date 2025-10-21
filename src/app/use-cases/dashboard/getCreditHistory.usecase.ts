// Get credit history use case
import { DashboardService } from "../../services/dashboard.service";
import { logger } from "../../../infrastructure/utils/logger";

export const getCreditHistoryUseCase = async (userId: string): Promise<any> => {
  try {
    logger.debug(`Getting credit history for user ${userId}`);

    if (!userId) {
      throw new Error("User ID is required");
    }

    const history = await DashboardService.getCreditHistory(userId);

    logger.debug(`Successfully retrieved credit history for user ${userId}`);
    return history;
  } catch (error) {
    logger.error(`Failed to get credit history for user ${userId}:`, error);
    throw error;
  }
};
