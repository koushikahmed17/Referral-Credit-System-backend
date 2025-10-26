import { z } from "zod";

// Auth validation schemas
export const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(255, "Email cannot exceed 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  referralCode: z
    .string()
    .min(6, "Referral code must be at least 6 characters")
    .max(10, "Referral code cannot exceed 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Referral code can only contain uppercase letters and numbers"
    )
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const verifyTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(128, "New password cannot exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(128, "New password cannot exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});





