export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralCode: string;
  referredBy?: string | undefined;
  credits: number;
  isActive: boolean;
  lastLoginAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralCode?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}
