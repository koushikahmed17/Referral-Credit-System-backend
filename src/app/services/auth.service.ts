import { UserModel } from "../../domain/models/user.model";
import { AuthResponse, RegisterDTO } from "../interfaces/auth.interface";
import { Hash } from "../../infrastructure/security/hash";
import { JWT } from "../../infrastructure/security/jwt";
import { ReferralService } from "./referral.service";
import { logger } from "../../infrastructure/utils/logger";

export class AuthService {
  static async registerUser(data: RegisterDTO): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email: data.email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Validate password strength
      const passwordValidation = Hash.validatePasswordStrength(data.password);
      if (!passwordValidation.isValid) {
        throw new Error(
          `Password validation failed: ${passwordValidation.errors.join(", ")}`
        );
      }

      // Hash password
      const hashedPassword = await Hash.hashPassword(data.password);

      // Create new user (always let model generate referralCode)
      const newUser = new UserModel({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        credits: 0,
        isActive: true,
      });

      await newUser.save();

      // Handle referral code if provided
      if (data.referralCode) {
        try {
          await ReferralService.applyReferralCode(
            data.referralCode,
            (newUser._id as any).toString()
          );
          logger.info(
            `Applied referral code ${data.referralCode} for user ${newUser.email}`
          );
        } catch (referralError: any) {
          // Log referral error but don't fail registration
          logger.warn(
            `Failed to apply referral code ${data.referralCode} for user ${newUser.email}:`,
            referralError.message
          );
        }
      }

      // Generate JWT token
      const token = JWT.signToken({
        userId: (newUser._id as any).toString(),
        email: newUser.email,
      });

      const expiresIn = JWT.getTokenExpiration();

      logger.info(`User registered successfully: ${newUser.email}`);

      return {
        user: {
          id: (newUser._id as any).toString(),
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          referralCode: newUser.referralCode,
          referredBy: newUser.referredBy,
          credits: newUser.credits,
          isActive: newUser.isActive,
          lastLoginAt: newUser.lastLoginAt,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        token,
        expiresIn: `${expiresIn}s`,
      };
    } catch (error) {
      logger.error("Registration failed:", error);
      throw error;
    }
  }

  static async loginUser(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await UserModel.findOne({ email: data.email.toLowerCase() });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      if (!user.isActive) {
        throw new Error("Account is deactivated");
      }

      // Verify password
      const isPasswordValid = await Hash.comparePassword(
        data.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate JWT token
      const token = JWT.signToken({
        userId: (user._id as any).toString(),
        email: user.email,
      });

      const expiresIn = JWT.getTokenExpiration();

      logger.info(`User logged in successfully: ${user.email}`);

      return {
        user: {
          id: (user._id as any).toString(),
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
        token,
        expiresIn: `${expiresIn}s`,
      };
    } catch (error) {
      logger.error("Login failed:", error);
      throw error;
    }
  }
}
