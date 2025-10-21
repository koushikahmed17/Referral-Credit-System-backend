// Verify data integrity use case
import { DashboardService } from "../../services/dashboard.service";
import { logger } from "../../../infrastructure/utils/logger";

export const verifyDataIntegrityUseCase = async (
  userId: string
): Promise<any> => {
  try {
    logger.debug(`Verifying data integrity for user ${userId}`);

    if (!userId) {
      throw new Error("User ID is required");
    }

    const result = await DashboardService.verifyDataIntegrity(userId);

    if (!result.isValid) {
      logger.warn(
        `Data integrity issues found for user ${userId}:`,
        result.issues
      );
    } else {
      logger.debug(`Data integrity verified for user ${userId}`);
    }

    return result;
  } catch (error) {
    logger.error(`Failed to verify data integrity for user ${userId}:`, error);
    throw error;
  }
};
