import { Request, Response } from "express";
import { registerUserUseCase } from "../../app/use-cases/auth/registerUser.usecase";
import { loginUserUseCase } from "../../app/use-cases/auth/loginUser.usecase";
import { verifyTokenUseCase } from "../../app/use-cases/auth/verifyToken.usecase";
import { refreshTokenUseCase } from "../../app/use-cases/auth/refreshToken.usecase";
import { logger } from "../../infrastructure/utils/logger";
import { JWT } from "../../infrastructure/security/jwt";

export const AuthController = {
  /**
   * Register a new user
   */
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await registerUserUseCase(req.body);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error: any) {
      logger.error("Registration controller error:", error);

      res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Login an existing user
   */
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await loginUserUseCase(req.body);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      logger.error("Login controller error:", error);

      res.status(401).json({
        success: false,
        message: error.message || "Login failed",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Get current user profile
   */
  profile: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;

      res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: {
          user: user,
        },
      });
    } catch (error: any) {
      logger.error("Profile controller error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to retrieve profile",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Verify token endpoint
   */
  verify: async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Token is required",
        });
        return;
      }

      const result = await verifyTokenUseCase(token);

      res.status(200).json({
        success: true,
        message: "Token is valid",
        data: result,
      });
    } catch (error: any) {
      logger.error("Token verification controller error:", error);

      res.status(401).json({
        success: false,
        message: error.message || "Token verification failed",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Refresh token endpoint
   */
  refresh: async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Token is required",
        });
        return;
      }

      const result = await refreshTokenUseCase(token);

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (error: any) {
      logger.error("Token refresh controller error:", error);

      res.status(401).json({
        success: false,
        message: error.message || "Token refresh failed",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  /**
   * Logout endpoint (client-side token removal)
   */
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;

      if (token) {
        JWT.revokeToken(token);
      }

      res.status(200).json({
        success: true,
        message: "Logout successful.",
      });
    } catch (error: any) {
      logger.error("Logout controller error:", error);

      res.status(500).json({
        success: false,
        message: "Logout failed",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },
};
