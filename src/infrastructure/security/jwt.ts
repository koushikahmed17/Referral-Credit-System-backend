import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { TokenPayload } from "../../app/interfaces/auth.interface";
import { logger } from "../utils/logger";

export const JWT = {
  // In-memory revoked token store with expiry (token -> expiresAtMs)
  _revokedTokens: new Map<string, number>(),

  _cleanupRevoked(): void {
    const now = Date.now();
    for (const [tok, exp] of JWT._revokedTokens.entries()) {
      if (exp <= now) JWT._revokedTokens.delete(tok);
    }
  },

  revokeToken: (token: string): void => {
    try {
      // Try to read exp from token; fallback to configured TTL
      const decoded: any = jwt.decode(token);
      const expMs = decoded?.exp
        ? decoded.exp * 1000
        : Date.now() + JWT.getTokenExpiration() * 1000;
      JWT._revokedTokens.set(token, expMs);
      JWT._cleanupRevoked();
      logger.info("Token revoked successfully");
    } catch (error) {
      logger.error("Failed to revoke token:", error);
    }
  },

  _isRevoked: (token: string): boolean => {
    JWT._cleanupRevoked();
    const exp = JWT._revokedTokens.get(token);
    if (!exp) return false;
    if (exp <= Date.now()) {
      JWT._revokedTokens.delete(token);
      return false;
    }
    return true;
  },
  /**
   * Sign a JWT token
   */
  signToken: (payload: Omit<TokenPayload, "iat" | "exp">): string => {
    try {
      return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: ENV.JWT_EXPIRES_IN,
        issuer: "referral-credit-system",
        audience: "referral-credit-system-users",
      } as jwt.SignOptions);
    } catch (error) {
      logger.error("JWT signing error:", error);
      throw new Error("Failed to sign token");
    }
  },

  /**
   * Sign a refresh token
   */
  signRefreshToken: (payload: Omit<TokenPayload, "iat" | "exp">): string => {
    try {
      return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
        expiresIn: ENV.JWT_REFRESH_EXPIRES_IN,
        issuer: "referral-credit-system",
        audience: "referral-credit-system-users",
      } as jwt.SignOptions);
    } catch (error) {
      logger.error("JWT refresh token signing error:", error);
      throw new Error("Failed to sign refresh token");
    }
  },

  /**
   * Verify a JWT token
   */
  verifyToken: (token: string): TokenPayload => {
    try {
      if (JWT._isRevoked(token)) {
        throw new Error("Token revoked");
      }
      return jwt.verify(token, ENV.JWT_SECRET, {
        issuer: "referral-credit-system",
        audience: "referral-credit-system-users",
      }) as TokenPayload;
    } catch (error) {
      logger.error("JWT verification error:", error);
      throw new Error("Invalid or expired token");
    }
  },

  /**
   * Verify a refresh token
   */
  verifyRefreshToken: (token: string): TokenPayload => {
    try {
      return jwt.verify(token, ENV.JWT_REFRESH_SECRET, {
        issuer: "referral-credit-system",
        audience: "referral-credit-system-users",
      }) as TokenPayload;
    } catch (error) {
      logger.error("JWT refresh token verification error:", error);
      throw new Error("Invalid or expired refresh token");
    }
  },

  /**
   * Get token expiration time in seconds
   */
  getTokenExpiration: (): number => {
    const expiresIn = ENV.JWT_EXPIRES_IN;
    if (expiresIn.endsWith("h")) {
      return parseInt(expiresIn) * 3600;
    } else if (expiresIn.endsWith("d")) {
      return parseInt(expiresIn) * 86400;
    } else if (expiresIn.endsWith("m")) {
      return parseInt(expiresIn) * 60;
    } else {
      return parseInt(expiresIn);
    }
  },

  /**
   * Decode token without verification (for debugging)
   */
  decodeToken: (token: string): any => {
    try {
      return jwt.decode(token);
    } catch (error) {
      logger.error("JWT decode error:", error);
      throw new Error("Failed to decode token");
    }
  },
};
