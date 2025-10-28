/**
 * Production-ready logging utility
 * Automatically disables console logs in production mode
 */

const isDevelopment = import.meta.env.MODE === 'development';
const enableDebugLogs = import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true';

class Logger {
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  /**
   * Log informational messages (only in development)
   */
  log(...args: any[]) {
    if (isDevelopment || enableDebugLogs) {
      console.log(this.prefix ? `[${this.prefix}]` : '', ...args);
    }
  }

  /**
   * Log debug messages (only in development)
   */
  debug(...args: any[]) {
    if (isDevelopment || enableDebugLogs) {
      console.debug(this.prefix ? `[${this.prefix}]` : '', ...args);
    }
  }

  /**
   * Log informational messages (only in development)
   */
  info(...args: any[]) {
    if (isDevelopment || enableDebugLogs) {
      console.info(this.prefix ? `[${this.prefix}]` : '', ...args);
    }
  }

  /**
   * Log warning messages (always logged)
   */
  warn(...args: any[]) {
    console.warn(this.prefix ? `[${this.prefix}]` : '', ...args);
    // TODO: Send to error tracking service in production
  }

  /**
   * Log error messages (always logged)
   */
  error(...args: any[]) {
    console.error(this.prefix ? `[${this.prefix}]` : '', ...args);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    this.reportError(args);
  }

  /**
   * Report error to monitoring service
   */
  private reportError(args: any[]) {
    if (!isDevelopment) {
      // TODO: Integrate with your error tracking service
      // Example: Sentry.captureException(error);
    }
  }

  /**
   * Create a new logger with a specific prefix
   */
  static create(prefix: string): Logger {
    return new Logger(prefix);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export logger class for creating prefixed loggers
export default Logger;

// Helper function to conditionally log in development only
export const devLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

// Helper function for performance logging
export const logPerformance = (label: string, callback: () => void) => {
  if (isDevelopment) {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
  } else {
    callback();
  }
};
