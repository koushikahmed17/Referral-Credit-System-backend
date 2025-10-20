export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  status: "pending" | "completed" | "cancelled";
  rewardAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReferralRequest {
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  rewardAmount?: number;
}

export interface UpdateReferralRequest {
  status?: "pending" | "completed" | "cancelled";
  rewardAmount?: number;
}
