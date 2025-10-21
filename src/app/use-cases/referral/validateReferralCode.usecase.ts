// Validate referral use case
import { ReferralService } from "../../services/referral.service";
import { logger } from "../../../infrastructure/utils/logger";

export const validateReferralCodeUseCase = async (referralCode: string) => {
  try {
    logger.debug(`Validating referral code ${referralCode}`);

    if (!referralCode) {
      throw new Error("Referral code is required");
    }

    const details = await ReferralService.getReferralCodeDetails(referralCode);

    logger.debug(`Successfully validated referral code ${referralCode}`);
    return details;
  } catch (error) {
    logger.error(`Failed to validate referral code ${referralCode}:`, error);
    throw error;
  }
};
