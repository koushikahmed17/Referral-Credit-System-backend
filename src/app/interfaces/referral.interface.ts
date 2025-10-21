import { ReferralStatus } from "../../domain/entities/Referral";

export interface ReferralStats {
  totalReferred: number;
  converted: number;
  pending: number;
  totalCredits: number;
  referralLink: string;
  referralCode: string;
}

export interface CreateReferralRequest {
  name?: string; // Optional name for generating referral code
}

export interface ApplyReferralRequest {
  referralCode: string;
  userId: string;
}

export interface ReferralResponse {
  id: string;
  referrerId: string;
  referredUserId?: string;
  status: ReferralStatus;
  creditsEarned: number;
  referralCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralListResponse {
  referrals: ReferralResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReferralServiceInterface {
  generateReferralCode(userId: string, name?: string): Promise<string>;
  applyReferralCode(
    referralCode: string,
    newUserId: string
  ): Promise<ReferralResponse>;
  getReferralStats(userId: string): Promise<ReferralStats>;
  getUserReferrals(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<ReferralListResponse>;
  convertReferral(referralId: string): Promise<ReferralResponse>;
  validateReferralCode(referralCode: string): Promise<boolean>;
}
