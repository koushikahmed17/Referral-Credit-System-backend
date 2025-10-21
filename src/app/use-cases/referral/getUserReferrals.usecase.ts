// Get user referrals use case
import { ReferralService } from "../../services/referral.service";
import { ReferralListResponse } from "../../interfaces/referral.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const getUserReferralsUseCase = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReferralListResponse> => {
  try {
    logger.debug(
      `Getting referrals for user ${userId}, page ${page}, limit ${limit}`
    );

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate pagination parameters
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit));

    const referrals = await ReferralService.getUserReferrals(
      userId,
      validPage,
      validLimit
    );

    logger.debug(`Successfully retrieved referrals for user ${userId}`);
    return referrals;
  } catch (error) {
    logger.error(`Failed to get referrals for user ${userId}:`, error);
    throw error;
  }
};
