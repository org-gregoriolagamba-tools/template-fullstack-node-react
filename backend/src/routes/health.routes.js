/**
 * Health Check Routes
 * 
 * Provides endpoints for monitoring application health.
 */

import { Router } from "express";
import { getConnectionStatus } from "../config/database.js";

const router = Router();

/**
 * Basic health check
 * GET /api/health
 */
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Detailed health check
 * GET /api/health/detailed
 */
router.get("/detailed", (req, res) => {
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status: getConnectionStatus(),
    },
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
    },
    node: {
      version: process.version,
      platform: process.platform,
    },
  });
});

/**
 * Readiness check (for Kubernetes)
 * GET /api/health/ready
 */
router.get("/ready", (req, res) => {
  const dbStatus = getConnectionStatus();
  
  if (dbStatus !== "connected") {
    return res.status(503).json({
      status: "not ready",
      database: dbStatus,
    });
  }
  
  res.json({
    status: "ready",
    database: dbStatus,
  });
});

/**
 * Liveness check (for Kubernetes)
 * GET /api/health/live
 */
router.get("/live", (req, res) => {
  res.json({
    status: "alive",
  });
});

export default router;
