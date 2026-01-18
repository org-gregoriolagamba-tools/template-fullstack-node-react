/**
 * Authentication Middleware
 * 
 * Provides JWT-based authentication for protected routes.
 * Includes role-based access control functionality.
 */

import jwt from "jsonwebtoken";
import config from "../config/index.js";
import User from "../models/User.model.js";
import { AppError } from "../utils/AppError.js";

/**
 * Verify JWT token and attach user to request
 * Use this middleware to protect routes that require authentication
 */
export const authenticate = async (req, res, next) => {
  try {
    // 1) Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("No authentication token provided", 401));
    }
    
    const token = authHeader.split(" ")[1];
    
    // 2) Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(new AppError("Token has expired", 401));
      }
      if (error.name === "JsonWebTokenError") {
        return next(new AppError("Invalid token", 401));
      }
      throw error;
    }
    
    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }
    
    // 4) Check if user is active
    if (!user.isActive) {
      return next(new AppError("User account is deactivated", 401));
    }
    
    // 5) Check if user changed password after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("Password was changed. Please log in again", 401));
    }
    
    // 6) Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Authentication failed", 401));
  }
};

/**
 * Restrict access to specific roles
 * Use this middleware after authenticate middleware
 * @param  {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    
    next();
  };
};

/**
 * Optional authentication - attach user if token is valid, but don't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid or expired - continue without user
    }
    
    next();
  } catch (error) {
    next();
  }
};
