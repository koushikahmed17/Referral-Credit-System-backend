// Create purchase use case
import { PurchaseService } from "../../services/purchase.service";
import {
  CreatePurchaseDTO,
  PurchaseResponse,
} from "../../interfaces/purchase.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const createPurchaseUseCase = async (
  data: CreatePurchaseDTO
): Promise<PurchaseResponse> => {
  try {
    logger.info(`Creating purchase for user: ${data.userId}`);

    // Validate input
    if (!data.userId || !data.amount || !data.description) {
      throw new Error("User ID, amount, and description are required");
    }

    if (data.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const result = await PurchaseService.createPurchase(data);

    logger.info(`Purchase created successfully for user: ${data.userId}`);
    return result;
  } catch (error) {
    logger.error(`Failed to create purchase for user ${data.userId}:`, error);
    throw error;
  }
};
