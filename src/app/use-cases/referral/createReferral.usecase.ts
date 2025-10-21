// Create referral use case
import { ReferralService } from "../../services/referral.service";
import { logger } from "../../../infrastructure/utils/logger";

export const createReferralUseCase = async (
  userId: string,
  name?: string
): Promise<string> => {
  try {
    logger.info(
      `Creating referral code for user ${userId} with name ${name || "no name"}`
    );

    if (!userId) {
      throw new Error("User ID is required");
    }

    const referralCode = await ReferralService.generateReferralCode(
      userId,
      name
    );

    logger.info(
      `Successfully created referral code ${referralCode} for user ${userId}`
    );
    return referralCode;
  } catch (error) {
    logger.error(`Failed to create referral for user ${userId}:`, error);
    throw error;
  }
};
