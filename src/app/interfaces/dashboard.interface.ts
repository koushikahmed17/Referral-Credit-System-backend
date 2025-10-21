// Dashboard interfaces

export interface DashboardStats {
  totalReferredUsers: number;
  referredUsersWhoPurchased: number;
  totalCreditsEarned: number;
  referralLink: string;
  referralCode: string;
  userInfo: {
    email: string;
    firstName: string;
    lastName: string;
    totalCredits: number;
    joinedDate: Date;
  };
  recentReferrals: RecentReferral[];
  recentPurchases: RecentPurchase[];
}

export interface RecentReferral {
  id: string;
  referredUserName: string;
  status: string;
  creditsEarned: number;
  createdAt: Date;
}

export interface RecentPurchase {
  id: string;
  amount: number;
  description: string;
  status: string;
  createdAt: Date;
}

export interface DashboardSummary {
  overview: {
    totalReferredUsers: number;
    referredUsersWhoPurchased: number;
    pendingReferrals: number;
    totalCreditsEarned: number;
  };
  referralInfo: {
    referralCode: string;
    referralLink: string;
    shareableMessage: string;
  };
  activity: {
    recentReferrals: RecentReferral[];
    recentPurchases: RecentPurchase[];
  };
}
