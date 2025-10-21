// Purchase system interfaces

export interface CreatePurchaseDTO {
  userId: string;
  amount: number;
  description: string;
  productId?: string;
  metadata?: Record<string, any>;
}

export interface Purchase {
  id: string;
  userId: string;
  amount: number;
  description: string;
  productId?: string;
  metadata?: Record<string, any>;
  status: PurchaseStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum PurchaseStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface PurchaseResponse {
  purchase: Purchase;
  referralReward?: {
    awarded: boolean;
    creditsEarned: number;
    message: string;
  };
}

export interface PurchaseStats {
  totalPurchases: number;
  totalAmount: number;
  completedPurchases: number;
  pendingPurchases: number;
  averageAmount: number;
}
