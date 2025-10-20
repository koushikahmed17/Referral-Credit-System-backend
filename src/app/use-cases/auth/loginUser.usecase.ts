import { AuthService } from "../../services/auth.service";
import { AuthResponse, LoginDTO } from "../../interfaces/auth.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const loginUserUseCase = async (
  data: LoginDTO
): Promise<AuthResponse> => {
  try {
    logger.info(`Login attempt for user: ${data.email}`);

    // Validate input data
    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    // Call the auth service
    const result = await AuthService.loginUser(data);

    logger.info(`User logged in successfully: ${data.email}`);
    return result;
  } catch (error) {
    logger.error(`Login failed for ${data.email}:`, error);
    throw error;
  }
};
