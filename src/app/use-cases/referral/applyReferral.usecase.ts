// Apply referral use case
import { ReferralService } from "../../services/referral.service";
import { ReferralResponse } from "../../interfaces/referral.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const applyReferralUseCase = async (
  referralCode: string,
  newUserId: string
): Promise<ReferralResponse> => {
  try {
    logger.info(`Applying referral code ${referralCode} for user ${newUserId}`);

    if (!referralCode || !newUserId) {
      throw new Error("Referral code and user ID are required");
    }

    const referral = await ReferralService.applyReferralCode(
      referralCode,
      newUserId
    );

    logger.info(
      `Successfully applied referral code ${referralCode} for user ${newUserId}`
    );
    return referral;
  } catch (error) {
    logger.error(
      `Failed to apply referral code ${referralCode} for user ${newUserId}:`,
      error
    );
    throw error;
  }
};
