const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel =
  logLevels[process.env.LOG_LEVEL as keyof typeof logLevels] || logLevels.INFO;

export const logger = {
  error: (message: string, ...args: unknown[]): void => {
    if (currentLogLevel >= logLevels.ERROR) {
      console.error(
        `[ERROR] ${new Date().toISOString()} - ${message}`,
        ...args
      );
    }
  },

  warn: (message: string, ...args: unknown[]): void => {
    if (currentLogLevel >= logLevels.WARN) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },

  info: (message: string, ...args: unknown[]): void => {
    if (currentLogLevel >= logLevels.INFO) {
      console.info(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },

  debug: (message: string, ...args: unknown[]): void => {
    if (currentLogLevel >= logLevels.DEBUG) {
      console.debug(
        `[DEBUG] ${new Date().toISOString()} - ${message}`,
        ...args
      );
    }
  },
};
