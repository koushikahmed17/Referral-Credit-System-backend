import app from "./server";
import { ENV, validateEnvironment } from "./infrastructure/config/env";
import {
  connectDatabase,
  disconnectDatabase,
} from "./infrastructure/config/database";
import { logger } from "./infrastructure/utils/logger";

const startServer = async (): Promise<void> => {
  try {
    // Validate environment variables
    validateEnvironment();

    // Connect to database
    await connectDatabase();

    // Start server
    const server = app.listen(ENV.PORT, () => {
      logger.info(`🚀 Server running on port ${ENV.PORT}`);
      logger.info(`📍 Environment: ${ENV.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${ENV.PORT}/api/health`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await disconnectDatabase();
          logger.info("Database connection closed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during graceful shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default startServer;
