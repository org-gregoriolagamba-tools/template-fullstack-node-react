/**
 * Application Configuration
 * 
 * Centralizes all environment variables and configuration settings.
 * Uses dotenv to load environment variables from .env file.
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const config = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3001,
  
  // Database configuration
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/fullstack_app",
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  
  // Bcrypt configuration
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  
  // Email configuration (optional - for password reset, notifications, etc.)
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  emailFrom: process.env.EMAIL_FROM || "noreply@example.com",
};

// Validate required configuration in production
if (config.nodeEnv === "production") {
  const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
}

export default config;
