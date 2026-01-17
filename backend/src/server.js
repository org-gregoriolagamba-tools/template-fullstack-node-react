/**
 * Main Server Entry Point
 * 
 * This is the primary entry point for the Express application.
 * It initializes all middleware, routes, and database connections.
 */

import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { Server as SocketIO } from "socket.io";

import config from "./config/index.js";
import { connectDatabase } from "./config/database.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import healthRoutes from "./routes/health.routes.js";

// Import socket handlers
import { initializeSocketHandlers } from "./sockets/index.js";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create Socket.IO server
const io = new SocketIO(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ========================
// Security Middleware
// ========================
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// ========================
// Request Processing
// ========================
app.use(compression()); // Gzip compression
app.use(express.json({ limit: "10mb" })); // JSON body parser
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // URL-encoded body parser

// ========================
// Logging
// ========================
if (config.nodeEnv !== "test") {
  app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
}
app.use(requestLogger);

// ========================
// API Routes
// ========================
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ========================
// Error Handling
// ========================
app.use(notFoundHandler);
app.use(errorHandler);

// ========================
// Socket.IO Handlers
// ========================
initializeSocketHandlers(io);

// ========================
// Server Startup
// ========================
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Start listening
    server.listen(config.port, () => {
      console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`📡 API available at http://localhost:${config.port}/api`);
      console.log(`🔌 WebSocket server ready`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});

startServer();

export { app, server, io };
