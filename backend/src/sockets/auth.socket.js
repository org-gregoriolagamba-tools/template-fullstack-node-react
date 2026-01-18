/**
 * Socket Authentication
 * 
 * Middleware for authenticating Socket.IO connections.
 */

import jwt from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/User.model.js";

/**
 * Authenticate socket connection using JWT
 * @param {Socket} socket - Socket.IO socket instance
 * @param {Function} next - Next middleware function
 */
export const authenticateSocket = async (socket, next) => {
  try {
    // Get token from handshake auth or query
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    
    if (!token) {
      // Allow unauthenticated connections but without user data
      socket.user = null;
      return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      socket.user = null;
      return next();
    }
    
    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    // Token invalid - allow connection but without user
    socket.user = null;
    next();
  }
};

/**
 * Require authentication for specific socket events
 * @param {Socket} socket - Socket.IO socket instance
 * @returns {boolean} Whether user is authenticated
 */
export const requireSocketAuth = (socket) => {
  if (!socket.user) {
    socket.emit("error", { 
      message: "Authentication required",
      code: "UNAUTHORIZED",
    });
    return false;
  }
  return true;
};
