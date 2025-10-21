import {
  connectDatabase,
  disconnectDatabase,
} from "../infrastructure/config/database";
import { UserModel } from "../domain/models/user.model";
import { Hash } from "../infrastructure/security/hash";
import { logger } from "../infrastructure/utils/logger";

/**
 * Seed Database Script
 * Creates sample users for testing
 *
 * Usage: npm run db:seed
 */

const seedDatabase = async (): Promise<void> => {
  try {
    logger.info("🌱 Starting database seeding...");

    // Connect to database
    await connectDatabase();

    // Check if users already exist
    const existingUsers = await UserModel.countDocuments();
    if (existingUsers > 0) {
      logger.warn(`⚠️  Database already has ${existingUsers} users`);
      logger.info("💡 Run 'npm run db:reset' first if you want to start fresh");
      return;
    }

    // Create sample users
    const password = await Hash.hashPassword("SecurePass123");

    // User 1: Lina (Referrer)
    const lina = new UserModel({
      email: "lina@example.com",
      password,
      firstName: "Lina",
      lastName: "Smith",
      credits: 0,
      isActive: true,
    });
    await lina.save();
    logger.info(`✅ Created user: Lina - Referral Code: ${lina.referralCode}`);

    // User 2: Ryan (Will be referred by Lina)
    const ryan = new UserModel({
      email: "ryan@example.com",
      password,
      firstName: "Ryan",
      lastName: "Johnson",
      credits: 0,
      isActive: true,
    });
    await ryan.save();
    logger.info(`✅ Created user: Ryan - Referral Code: ${ryan.referralCode}`);

    // User 3: Alice (No referral)
    const alice = new UserModel({
      email: "alice@example.com",
      password,
      firstName: "Alice",
      lastName: "Brown",
      credits: 0,
      isActive: true,
    });
    await alice.save();
    logger.info(
      `✅ Created user: Alice - Referral Code: ${alice.referralCode}`
    );

    logger.info("\n📋 Test Users Created:");
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(`Email: lina@example.com`);
    logger.info(`Password: SecurePass123`);
    logger.info(`Referral Code: ${lina.referralCode}`);
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(`Email: ryan@example.com`);
    logger.info(`Password: SecurePass123`);
    logger.info(`Referral Code: ${ryan.referralCode}`);
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(`Email: alice@example.com`);
    logger.info(`Password: SecurePass123`);
    logger.info(`Referral Code: ${alice.referralCode}`);
    logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    logger.info("✅ Database seeding completed!");
  } catch (error: any) {
    logger.error("❌ Database seeding failed:", error.message);
    throw error;
  } finally {
    // Disconnect from database
    await disconnectDatabase();
    process.exit(0);
  }
};

// Run the seed
seedDatabase().catch((error) => {
  logger.error("Fatal error during database seeding:", error);
  process.exit(1);
});
