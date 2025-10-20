// Authentication middleware
import { Request, Response, NextFunction } from "express";
// import { JWT } from "../../infrastructure/security/jwt";
import { verifyTokenUseCase } from "../../app/use-cases/auth/verifyToken.usecase";
import { logger } from "../../infrastructure/utils/logger";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
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
      };
    }
  }
}

/**
 * Authentication middleware to protect routes
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token is missing from authorization header",
      });
      return;
    }

    // Verify token and get user data
    const userData = await verifyTokenUseCase(token);

    // Attach user data to request object
    req.user = userData;

    logger.debug(`Authenticated user: ${userData.email}`);
    next();
  } catch (error: any) {
    logger.error("Authentication middleware error:", error);

    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      next();
      return;
    }

    // Try to verify token and get user data
    try {
      const userData = await verifyTokenUseCase(token);
      req.user = userData;
      logger.debug(`Optional authenticated user: ${userData.email}`);
    } catch (error) {
      // Token is invalid but we continue without authentication
      logger.debug(
        "Optional auth: Invalid token, continuing without authentication"
      );
    }

    next();
  } catch (error: any) {
    logger.error("Optional authentication middleware error:", error);
    next(); // Continue even if there's an error
  }
};

/**
 * Admin authentication middleware (requires admin role)
 */
export const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First check if user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Check if user is admin (you can extend the user model to include roles)
    // For now, we'll use a simple check - you can modify this based on your needs
    const isAdmin =
      req.user.user.email.includes("@admin.") ||
      req.user.user.email === "admin@example.com";

    if (!isAdmin) {
      res.status(403).json({
        success: false,
        message: "Admin access required",
      });
      return;
    }

    logger.debug(`Admin access granted to: ${req.user.email}`);
    next();
  } catch (error: any) {
    logger.error("Admin authentication middleware error:", error);

    res.status(403).json({
      success: false,
      message: "Admin authentication failed",
    });
  }
};

export default { authMiddleware, optionalAuthMiddleware, adminAuthMiddleware };
