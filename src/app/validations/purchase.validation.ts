import { z } from "zod";

/**
 * Validation schema for creating a purchase
 */
export const createPurchaseSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0")
    .max(1000000, "Amount cannot exceed 1,000,000"),

  description: z
    .string({
      required_error: "Description is required",
    })
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description cannot exceed 500 characters")
    .trim(),

  productId: z.string().trim().optional(),

  metadata: z.record(z.any()).optional(),
});

/**
 * Validation schema for getting purchase by ID
 */
export const getPurchaseByIdSchema = z.object({
  id: z
    .string({
      required_error: "Purchase ID is required",
    })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid purchase ID format"),
});

/**
 * Validation schema for pagination
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be greater than 0"),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
export type GetPurchaseByIdInput = z.infer<typeof getPurchaseByIdSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
