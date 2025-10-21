// Get purchase by ID use case
import { PurchaseService } from "../../services/purchase.service";
import { Purchase } from "../../interfaces/purchase.interface";
import { logger } from "../../../infrastructure/utils/logger";

export const getPurchaseByIdUseCase = async (
  purchaseId: string
): Promise<Purchase> => {
  try {
    logger.debug(`Getting purchase by ID: ${purchaseId}`);

    if (!purchaseId) {
      throw new Error("Purchase ID is required");
    }

    const purchase = await PurchaseService.getPurchaseById(purchaseId);

    logger.debug(`Successfully retrieved purchase: ${purchaseId}`);
    return purchase;
  } catch (error) {
    logger.error(`Failed to get purchase ${purchaseId}:`, error);
    throw error;
  }
};
