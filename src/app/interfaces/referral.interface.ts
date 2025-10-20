import { Referral } from "../../domain/entities/Referral";

export interface CreateReferralDTO {
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  rewardAmount?: number;
}

export interface ReferralResponse {
  referral: Referral;
  message: string;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalRewards: number;
  averageReward: number;
}

export interface ReferralServiceInterface {
  createReferral(data: CreateReferralDTO): Promise<ReferralResponse>;
  getReferralStats(userId: string): Promise<ReferralStats>;
  applyReferralCode(
    referralCode: string,
    userId: string
  ): Promise<ReferralResponse>;
  getUserReferrals(userId: string): Promise<Referral[]>;
  validateReferralCode(referralCode: string): Promise<boolean>;
}

export default ReferralServiceInterface;
