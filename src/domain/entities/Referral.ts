export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  status: ReferralStatus;
  creditsEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReferralStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export interface CreateReferralRequest {
  referrerId: string;
  referredUserId: string;
}
