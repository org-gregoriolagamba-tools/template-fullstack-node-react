/**
 * Request Logger Middleware
 * 
 * Custom logging middleware for debugging and monitoring.
 * Logs request details and response times.
 */

import config from "../config/index.js";

/**
 * Log incoming requests with timing information
 */
export const requestLogger = (req, res, next) => {
  // Skip logging in test environment
  if (config.nodeEnv === "test") {
    return next();
  }
  
  const start = Date.now();
  
  // Log request details
  const logRequest = () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
    };
    
    // Add user ID if authenticated
    if (req.user) {
      logData.userId = req.user._id;
    }
    
    // Color-coded logging based on status code
    const statusColor = res.statusCode >= 500
      ? "\x1b[31m" // Red
      : res.statusCode >= 400
        ? "\x1b[33m" // Yellow
        : res.statusCode >= 300
          ? "\x1b[36m" // Cyan
          : "\x1b[32m"; // Green
    
    const reset = "\x1b[0m";
    
    console.log(
      `${statusColor}${logData.method}${reset} ${logData.url} ${statusColor}${logData.status}${reset} - ${logData.duration}`
    );
  };
  
  // Log when response is finished
  res.on("finish", logRequest);
  
  next();
};

/**
 * Request ID middleware - adds unique ID to each request
 */
export const requestId = (req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader("X-Request-Id", req.id);
  next();
};
