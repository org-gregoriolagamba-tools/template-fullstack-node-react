/**
 * Authentication Controller
 * 
 * Handles user registration, login, logout, and token refresh.
 */

import User from "../models/User.model.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/asyncHandler.js";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.utils.js";
import { sendSuccess, sendCreated } from "../utils/response.utils.js";

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }
  
  // Create new user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
  });
  
  // Generate tokens
  const tokens = generateTokenPair(user);
  
  // Save refresh token to user
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });
  
  // Send response
  sendCreated(res, {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
    },
    ...tokens,
  }, "User registered successfully");
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  
  // Find user and verify credentials
  const user = await User.findByCredentials(email, password);
  
  // Check if user is active
  if (!user.isActive) {
    return next(new AppError("Your account has been deactivated", 401));
  }
  
  // Generate tokens
  const tokens = generateTokenPair(user);
  
  // Update refresh token and last login
  user.refreshToken = tokens.refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  
  // Send response
  sendSuccess(res, {
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
    },
    ...tokens,
  }, "Login successful");
});

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = catchAsync(async (req, res) => {
  // Clear refresh token
  if (req.user) {
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });
  }
  
  sendSuccess(res, null, "Logout successful");
});

/**
 * Refresh access token
 * POST /api/auth/refresh-token
 */
export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return next(new AppError("Refresh token is required", 400));
  }
  
  // Verify refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    return next(new AppError("Invalid or expired refresh token", 401));
  }
  
  // Find user and validate refresh token
  const user = await User.findById(decoded.id).select("+refreshToken");
  
  if (!user || user.refreshToken !== refreshToken) {
    return next(new AppError("Invalid refresh token", 401));
  }
  
  if (!user.isActive) {
    return next(new AppError("Your account has been deactivated", 401));
  }
  
  // Generate new tokens
  const tokens = generateTokenPair(user);
  
  // Update refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });
  
  sendSuccess(res, tokens, "Token refreshed successfully");
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = catchAsync(async (req, res) => {
  sendSuccess(res, {
    user: {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      fullName: req.user.fullName,
      role: req.user.role,
      isEmailVerified: req.user.isEmailVerified,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    },
  });
});

/**
 * Update password
 * PATCH /api/auth/update-password
 */
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await User.findById(req.user._id).select("+password");
  
  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 400));
  }
  
  // Update password
  user.password = newPassword;
  await user.save();
  
  // Generate new tokens
  const tokens = generateTokenPair(user);
  
  sendSuccess(res, tokens, "Password updated successfully");
});
