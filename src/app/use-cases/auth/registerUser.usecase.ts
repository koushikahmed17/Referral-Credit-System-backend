import { AuthService } from "../../services/auth.service";
import { AuthResponse, RegisterDTO } from "../../interfaces/auth.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const registerUserUseCase = async (
  data: RegisterDTO
): Promise<AuthResponse> => {
  try {
    logger.info(`Registering new user: ${data.email}`);

    // Call the auth service
    const result = await AuthService.registerUser(data);

    logger.info(`User registered successfully: ${data.email}`);
    return result;
  } catch (error) {
    logger.error(`Registration failed for ${data.email}:`, error);
    throw error;
  }
};
