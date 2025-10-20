import mongoose from "mongoose";
import { ENV } from "./env";
import { logger } from "../utils/logger";

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!ENV.MONGODB_URI) {
      logger.warn("⚠️ MONGODB_URI not defined, using default local connection");
      ENV.MONGODB_URI = "mongodb://localhost:27017/referral_credit_system";
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: "majority" as const,
    };

    await mongoose.connect(ENV.MONGODB_URI, options);

    logger.info("✅ MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("✅ MongoDB reconnected");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error("❌ MongoDB connection failed:", error);
    logger.warn("⚠️ Continuing without database connection for development");
    // Don't exit in development mode, allow server to start
    if (ENV.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("✅ MongoDB disconnected successfully");
  } catch (error) {
    logger.error("❌ Error disconnecting from MongoDB:", error);
  }
};
