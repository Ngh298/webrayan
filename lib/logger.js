/**
 * Logger Utility
 * سیستم لاگینگ حرفه‌ای با سطوح مختلف
 * در production فقط error و warn لاگ می‌شود
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * رنگ‌ها برای console (فقط در development)
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Format timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Format log message
 */
function formatMessage(level, message, data) {
  const timestamp = getTimestamp();
  const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataStr}`;
}

/**
 * Logger Class
 */
class Logger {
  /**
   * Debug - فقط در development
   */
  debug(message, ...args) {
    if (isDevelopment) {
      console.log(
        `${colors.cyan}🔍 [DEBUG]${colors.reset}`,
        message,
        ...args
      );
    }
  }

  /**
   * Info - فقط در development
   */
  info(message, ...args) {
    if (isDevelopment) {
      console.log(
        `${colors.blue}ℹ️  [INFO]${colors.reset}`,
        message,
        ...args
      );
    }
  }

  /**
   * Success - فقط در development
   */
  success(message, ...args) {
    if (isDevelopment) {
      console.log(
        `${colors.green}✅ [SUCCESS]${colors.reset}`,
        message,
        ...args
      );
    }
  }

  /**
   * Warning - در همه محیط‌ها
   */
  warn(message, ...args) {
    console.warn(`${colors.yellow}⚠️  [WARN]${colors.reset}`, message, ...args);
  }

  /**
   * Error - در همه محیط‌ها
   */
  error(message, error, context) {
    const errorInfo = {
      message,
      error: error?.message || error,
      stack: error?.stack,
      context,
      timestamp: getTimestamp(),
    };

    console.error(`${colors.red}❌ [ERROR]${colors.reset}`, errorInfo);

    // در production می‌توان به سرویس monitoring فرستاد
    if (isProduction) {
      // TODO: ارسال به Sentry یا سرویس دیگر
      // Sentry.captureException(error, { extra: context });
    }
  }

  /**
   * Database logs
   */
  db(message, ...args) {
    if (isDevelopment) {
      console.log(
        `${colors.magenta}🗄️  [DB]${colors.reset}`,
        message,
        ...args
      );
    }
  }

  /**
   * API logs
   */
  api(method, path, status, duration) {
    if (isDevelopment) {
      const statusColor =
        status >= 500
          ? colors.red
          : status >= 400
            ? colors.yellow
            : colors.green;

      console.log(
        `${colors.cyan}🌐 [API]${colors.reset}`,
        `${method} ${path}`,
        `${statusColor}${status}${colors.reset}`,
        `(${duration}ms)`
      );
    }
  }

  /**
   * Auth logs
   */
  auth(message, ...args) {
    if (isDevelopment) {
      console.log(
        `${colors.magenta}🔐 [AUTH]${colors.reset}`,
        message,
        ...args
      );
    }
  }

  /**
   * Security logs - همیشه لاگ می‌شود
   */
  security(message, context) {
    console.warn(
      `${colors.red}🚨 [SECURITY]${colors.reset}`,
      formatMessage('SECURITY', message, context)
    );

    // در production حتماً باید لاگ شود
    if (isProduction) {
      // TODO: ارسال به سیستم امنیتی
    }
  }

  /**
   * Performance logs
   */
  performance(operation, duration) {
    if (isDevelopment) {
      const performanceColor =
        duration > 1000 ? colors.red : duration > 500 ? colors.yellow : colors.green;

      console.log(
        `${performanceColor}⚡ [PERFORMANCE]${colors.reset}`,
        `${operation}: ${duration}ms`
      );
    }
  }

  /**
   * Group logs (for better organization)
   */
  group(title) {
    if (isDevelopment) {
      console.group(`${colors.bright}📁 ${title}${colors.reset}`);
    }
  }

  groupEnd() {
    if (isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Table logs
   */
  table(data) {
    if (isDevelopment && data) {
      console.table(data);
    }
  }

  /**
   * Log with custom emoji and color
   */
  custom(emoji, message, ...args) {
    if (isDevelopment) {
      console.log(`${emoji} ${message}`, ...args);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export as default
export default logger;

/**
 * Performance Measurement Helper
 */
export function measurePerformance(operation) {
  const start = Date.now();

  return {
    end: () => {
      const duration = Date.now() - start;
      logger.performance(operation, duration);
      return duration;
    },
  };
}

/**
 * Async Performance Measurement
 */
export async function measureAsync(operation, asyncFn) {
  const start = Date.now();
  try {
    const result = await asyncFn();
    const duration = Date.now() - start;
    logger.performance(operation, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${operation} failed`, error, { duration });
    throw error;
  }
}

/**
 * Request Logger Middleware
 */
export function createRequestLogger() {
  return async (request, handler) => {
    const start = Date.now();
    const { method, url } = request;

    try {
      const response = await handler(request);
      const duration = Date.now() - start;
      logger.api(method, url, response.status, duration);
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`API Error: ${method} ${url}`, error, { duration });
      throw error;
    }
  };
}

