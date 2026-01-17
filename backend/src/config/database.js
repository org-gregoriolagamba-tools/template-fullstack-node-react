/**
 * Database Configuration
 * 
 * Handles MongoDB connection using Mongoose.
 * Provides connection and disconnection utilities.
 */

import mongoose from "mongoose";
import config from "./index.js";

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export const connectDatabase = async () => {
  try {
    const options = {
      // Modern Mongoose options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(config.mongoUri, options);
    
    console.log("✅ MongoDB connected successfully");
    
    // Connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
};

/**
 * Get database connection status
 * @returns {string} Connection state
 */
export const getConnectionStatus = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return states[mongoose.connection.readyState] || "unknown";
};

export default mongoose;
