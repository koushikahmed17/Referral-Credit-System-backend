import { z } from "zod";

// Common validation schemas
export const emailSchema = z.string().email("Invalid email format");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters");

// User validation schemas
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  referralCode: z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  isActive: z.boolean().optional(),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Referral validation schemas
export const createReferralSchema = z.object({
  referrerId: z.string().min(1, "Referrer ID is required"),
  referredUserId: z.string().min(1, "Referred user ID is required"),
});

// Credit validation schemas
export const createCreditSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["earned", "spent", "refunded"]),
  source: z.enum(["referral", "purchase", "admin", "promotion"]),
  description: z.string().min(1, "Description is required"),
});

// Purchase validation schemas
export const purchaseSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be at least $0.01")
    .max(10000, "Amount cannot exceed $10,000"),
  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .optional(),
  category: z
    .string()
    .max(50, "Category cannot exceed 50 characters")
    .optional(),
});

export const purchaseIdSchema = z.string().min(1, "Purchase ID is required");

// Common query parameters
export const paginationSchema = z.object({
  page: z
    .string()
    .transform(Number)
    .refine((n) => n > 0, "Page must be positive")
    .optional(),
  limit: z
    .string()
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, "Limit must be between 1 and 100")
    .optional(),
});
