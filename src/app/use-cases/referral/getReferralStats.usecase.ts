// Get referral stats use case
import { ReferralService } from "../../services/referral.service";
import { ReferralStats } from "../../interfaces/referral.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const getReferralStatsUseCase = async (
  userId: string
): Promise<ReferralStats> => {
  try {
    logger.debug(`Getting referral stats for user ${userId}`);

    if (!userId) {
      throw new Error("User ID is required");
    }

    const stats = await ReferralService.getReferralStats(userId);

    logger.debug(`Successfully retrieved referral stats for user ${userId}`);
    return stats;
  } catch (error) {
    logger.error(`Failed to get referral stats for user ${userId}:`, error);
    throw error;
  }
};
