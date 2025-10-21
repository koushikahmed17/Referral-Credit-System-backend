import { z } from "zod";

export const generateReferralSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
});

export const applyReferralSchema = z.object({
  referralCode: z.string().min(1, "Referral code is required"),
});

export const validateReferralCodeSchema = z.object({
  referralCode: z.string().min(1, "Referral code is required"),
});

export const getUserReferralsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
});

export const convertReferralSchema = z.object({
  referralId: z.string().min(1, "Referral ID is required"),
});
