import { Request, Response } from "express";
import { createPurchaseUseCase } from "../../app/use-cases/purchase/createPurchase.usecase";
import { getPurchaseByIdUseCase } from "../../app/use-cases/purchase/getPurchaseById.usecase";
import { getUserPurchasesUseCase } from "../../app/use-cases/purchase/getUserPurchases.usecase";
import { getPurchaseStatsUseCase } from "../../app/use-cases/purchase/getPurchaseStats.usecase";
import { logger } from "../../infrastructure/utils/logger";

export const PurchaseController = {
  /**
   * Create a new purchase
   * Automatically handles first-purchase referral rewards
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { amount, description, productId, metadata } = req.body;

      const result = await createPurchaseUseCase({
        userId,
        amount,
        description,
        productId,
        metadata,
      });

      res.status(201).json({
        success: true,
        message: "Purchase created successfully",
        data: result,
      });
    } catch (error: any) {
      logger.error("Create purchase controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to create purchase",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get purchase by ID
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const purchase = await getPurchaseByIdUseCase(id);

      // Ensure user can only access their own purchases
      if (purchase.userId !== userId) {
        res.status(403).json({
          success: false,
          message: "Access denied",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Purchase retrieved successfully",
        data: purchase,
      });
    } catch (error: any) {
      logger.error("Get purchase controller error:", error);

      res.status(404).json({
        success: false,
        message: error.message || "Purchase not found",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get user's purchases with pagination
   */
  getUserPurchases: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await getUserPurchasesUseCase(userId, page, limit);

      res.status(200).json({
        success: true,
        message: "Purchases retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      logger.error("Get user purchases controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to get purchases",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get purchase statistics for the authenticated user
   */
  getStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId;

      const stats = await getPurchaseStatsUseCase(userId);

      res.status(200).json({
        success: true,
        message: "Purchase stats retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      logger.error("Get purchase stats controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Failed to get purchase stats",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },
};
