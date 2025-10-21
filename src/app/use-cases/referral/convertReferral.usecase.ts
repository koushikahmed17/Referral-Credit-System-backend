// Convert referral use case
import { ReferralService } from "../../services/referral.service";
import { ReferralResponse } from "../../interfaces/referral.interface";
import { logger } from "../../../infrastructure/utils/logger";

/**
 * Convert a pending referral to confirmed
 * This is called when the referred user makes their first purchase
 */
export const convertReferralUseCase = async (
  referralId: string
): Promise<ReferralResponse> => {
  try {
    logger.info(`Converting referral ${referralId}`);

    if (!referralId) {
      throw new Error("Referral ID is required");
    }

    const result = await ReferralService.convertReferral(referralId);

    logger.info(`Successfully converted referral ${referralId}`);
    return result;
  } catch (error) {
    logger.error(`Failed to convert referral ${referralId}:`, error);
    throw error;
  }
};

/**
 * Convert referral by user ID (called when user makes first purchase)
 */
export const convertReferralByUserIdUseCase = async (
  userId: string
): Promise<ReferralResponse | null> => {
  try {
    logger.info(`Converting referral for user ${userId}`);

    if (!userId) {
      throw new Error("User ID is required");
    }

    const result = await ReferralService.convertReferralByUserId(userId);

    if (result) {
      logger.info(`Successfully converted referral for user ${userId}`);
    } else {
      logger.debug(`No pending referral found for user ${userId}`);
    }

    return result;
  } catch (error) {
    logger.error(`Failed to convert referral for user ${userId}:`, error);
    throw error;
  }
};
