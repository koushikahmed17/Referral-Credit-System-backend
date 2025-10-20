import { JWT } from "../../../infrastructure/security/jwt";
import { UserModel } from "../../../domain/models/user.model";
import { logger } from "../../../infrastructure/utils/logger";

export const refreshTokenUseCase = async (
  refreshToken: string
): Promise<{ token: string; expiresIn: string }> => {
  try {
    logger.debug("Refreshing token");

    // Verify the refresh token
    const payload = JWT.verifyRefreshToken(refreshToken);

    // Get user from database
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("User account is deactivated");
    }

    // Generate new access token
    const newToken = JWT.signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const expiresIn = JWT.getTokenExpiration();

    logger.debug(`Token refreshed for user: ${user.email}`);

    return {
      token: newToken,
      expiresIn: `${expiresIn}s`,
    };
  } catch (error) {
    logger.error("Token refresh failed:", error);
    throw error;
  }
};
