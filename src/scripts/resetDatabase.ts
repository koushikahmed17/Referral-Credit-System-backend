import mongoose from "mongoose";
import {
  connectDatabase,
  disconnectDatabase,
} from "../infrastructure/config/database";
import { logger } from "../infrastructure/utils/logger";

/**
 * Reset Database Script
 * WARNING: This will delete ALL data from the database!
 *
 * Usage: npm run db:reset
 */

const resetDatabase = async (): Promise<void> => {
  try {
    logger.info("🔄 Starting database reset...");

    // Connect to database
    await connectDatabase();

    // Get all collection names
    const collections = await mongoose.connection.db.collections();

    logger.info(`📊 Found ${collections.length} collections`);

    // Drop each collection
    for (const collection of collections) {
      const collectionName = collection.collectionName;
      logger.info(`🗑️  Dropping collection: ${collectionName}`);
      await collection.drop();
    }

    logger.info("✅ Database reset completed successfully!");
    logger.info("📝 All collections have been dropped");
  } catch (error: any) {
    logger.error("❌ Database reset failed:", error.message);
    throw error;
  } finally {
    // Disconnect from database
    await disconnectDatabase();
    process.exit(0);
  }
};

// Run the reset
resetDatabase().catch((error) => {
  logger.error("Fatal error during database reset:", error);
  process.exit(1);
});
