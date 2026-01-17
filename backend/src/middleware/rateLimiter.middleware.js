/**
 * Rate Limiter Middleware
 * 
 * Protects API endpoints from abuse by limiting request rates.
 * Uses express-rate-limit with in-memory store.
 */

import rateLimit from "express-rate-limit";
import config from "../config/index.js";

/**
 * Default rate limiter for general API endpoints
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs, // Default: 15 minutes
  max: config.rateLimitMaxRequests, // Default: 100 requests per window
  message: {
    status: "fail",
    message: "Too many requests, please try again later",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    status: "fail",
    message: "Too many login attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed requests
});

/**
 * Rate limiter for password reset endpoints
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    status: "fail",
    message: "Too many password reset attempts, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for registration endpoints
 */
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registrations per hour per IP
  message: {
    status: "fail",
    message: "Too many accounts created from this IP, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
