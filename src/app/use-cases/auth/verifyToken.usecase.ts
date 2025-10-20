import { JWT } from "../../../infrastructure/security/jwt";
import { UserModel } from "../../../domain/models/user.model";
import { TokenPayload } from "../../interfaces/auth.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const verifyTokenUseCase = async (
  token: string
): Promise<{
  userId: string;
  email: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    referralCode: string;
    referredBy?: string | undefined;
    credits: number;
    isActive: boolean;
    lastLoginAt?: Date | undefined;
    createdAt: Date;
    updatedAt: Date;
  };
}> => {
  try {
    logger.debug("Verifying token");

    // Verify the token
    const payload = JWT.verifyToken(token);

    // Get user from database
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("User account is deactivated");
    }

    logger.debug(`Token verified for user: ${user.email}`);

    return {
      userId: user._id.toString(),
      email: user.email,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        credits: user.credits,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    logger.error("Token verification failed:", error);
    throw error;
  }
};
