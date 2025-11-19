/**
 * Secure Logging Utility
 * Provides structured logging with levels and production safety
 */

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

// Current log level based on environment
const getCurrentLogLevel = () => {
  if (import.meta.env.PROD) {
    return LOG_LEVELS.ERROR; // Only errors in production
  }
  return import.meta.env.VITE_LOG_LEVEL 
    ? LOG_LEVELS[import.meta.env.VITE_LOG_LEVEL.toUpperCase()] 
    : LOG_LEVELS.DEBUG; // Default to DEBUG in development
};

class Logger {
  constructor() {
    this.currentLevel = getCurrentLogLevel();
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
    
    // Store original console methods to avoid circular dependencies
    this.originalConsole = {
      log: console.log.bind(console),
      error: console.error.bind(console),
      warn: console.warn.bind(console),
      info: console.info.bind(console)
    };
  }

  /**
   * Sanitize data before logging to prevent sensitive information exposure
   */
  sanitizeData(data) {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sensitiveKeys = [
      'password', 'token', 'key', 'secret', 'auth', 'credential',
      'email', 'phone', 'address', 'payment', 'card', 'ssn'
    ];

    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
    });

    return sanitized;
  }

  /**
   * Format log message with timestamp and context
   */
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const sanitizedContext = this.sanitizeData(context);
    
    return {
      timestamp,
      level,
      message,
      context: sanitizedContext,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  /**
   * Send logs to external service in production (optional)
   */
  async sendToLogService(logData) {
    if (!this.isProduction) return;
    
    try {
      // Example: Send to external logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logData)
      // });
    } catch (error) {
      // Fail silently to avoid logging loops
    }
  }

  /**
   * Core logging method
   */
  log(level, message, context = {}) {
    if (level > this.currentLevel) return;

    const logData = this.formatMessage(
      Object.keys(LOG_LEVELS)[level], 
      message, 
      context
    );

    // In development, use console with colors
    if (this.isDevelopment) {
      const colors = {
        ERROR: '\x1b[31m', // Red
        WARN: '\x1b[33m',  // Yellow
        INFO: '\x1b[36m',  // Cyan
        DEBUG: '\x1b[32m', // Green
        TRACE: '\x1b[90m'  // Gray
      };
      
      const reset = '\x1b[0m';
      const color = colors[logData.level] || '';
      
      this.originalConsole.log(
        `${color}[${logData.timestamp}] ${logData.level}:${reset}`,
        message,
        Object.keys(context).length > 0 ? context : ''
      );
    }

    // In production, send to logging service
    if (this.isProduction && level <= LOG_LEVELS.WARN) {
      this.sendToLogService(logData);
    }
  }

  /**
   * Log level methods
   */
  error(message, context = {}) {
    this.log(LOG_LEVELS.ERROR, message, context);
    
    // Also send errors to console.error in production for critical issues
    if (this.isProduction) {
      this.originalConsole.error(`[ERROR] ${message}`, this.sanitizeData(context));
    }
  }

  warn(message, context = {}) {
    this.log(LOG_LEVELS.WARN, message, context);
  }

  info(message, context = {}) {
    this.log(LOG_LEVELS.INFO, message, context);
  }

  debug(message, context = {}) {
    this.log(LOG_LEVELS.DEBUG, message, context);
  }

  trace(message, context = {}) {
    this.log(LOG_LEVELS.TRACE, message, context);
  }

  /**
   * Performance logging
   */
  time(label) {
    if (this.isDevelopment) {
      this.originalConsole.log(`⏱️ Timer started: ${label}`);
    }
  }

  timeEnd(label) {
    if (this.isDevelopment) {
      this.originalConsole.log(`⏱️ Timer ended: ${label}`);
    }
  }

  /**
   * Group logging for related operations
   */
  group(label) {
    if (this.isDevelopment) {
      this.originalConsole.log(`📁 Group: ${label}`);
    }
  }

  groupEnd() {
    if (this.isDevelopment) {
      this.originalConsole.log(`📁 Group ended`);
    }
  }

  /**
   * Authentication specific logging
   */
  authEvent(event, details = {}) {
    this.info(`Auth Event: ${event}`, {
      event,
      timestamp: new Date().toISOString(),
      ...this.sanitizeData(details)
    });
  }

  /**
   * API request logging
   */
  apiRequest(method, url, status, duration) {
    const level = status >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    this.log(level, `API ${method} ${url}`, {
      method,
      url,
      status,
      duration: `${duration}ms`
    });
  }

  /**
   * User action logging
   */
  userAction(action, details = {}) {
    this.info(`User Action: ${action}`, {
      action,
      ...this.sanitizeData(details)
    });
  }
}

// Create singleton instance
const logger = new Logger();

// Export both the instance and the class
export default logger;
export { Logger, LOG_LEVELS };

// Note: Console override removed to prevent circular dependencies
// Use logger directly instead of console methods for better control
