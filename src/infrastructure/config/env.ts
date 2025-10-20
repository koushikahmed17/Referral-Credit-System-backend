import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/referral-system",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_FILE: process.env.LOG_FILE || "logs/app.log",
};

export const validateEnvironment = (): void => {
  // Only validate in production environment
  if (ENV.NODE_ENV === "production") {
    const requiredEnvVars = ["JWT_SECRET", "JWT_REFRESH_SECRET"];

    for (const envVar of requiredEnvVars) {
      if (
        !process.env[envVar] ||
        process.env[envVar] === "your-secret-key" ||
        process.env[envVar] === "your-super-secret-jwt-key-here" ||
        process.env[envVar] === "your-super-secret-refresh-key-here"
      ) {
        throw new Error(`Environment variable ${envVar} is not properly set`);
      }
    }
  }
};
