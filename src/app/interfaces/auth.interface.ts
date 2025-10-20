import { User } from "../../domain/entities/User";

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralCode?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
  expiresIn: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthServiceInterface {
  registerUser(data: RegisterDTO): Promise<AuthResponse>;
  loginUser(data: LoginDTO): Promise<AuthResponse>;
  verifyToken(token: string): Promise<TokenPayload | null>;
  refreshToken(token: string): Promise<{ token: string; expiresIn: string }>;
}

export interface AuthRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
  createUser(userData: RegisterDTO): Promise<User>;
  updateLastLogin(userId: string): Promise<void>;
}

export default AuthRepositoryInterface;
