/**
 * User Controller
 * 
 * Handles user management operations (CRUD).
 */

import User from "../models/User.model.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/asyncHandler.js";
import { sendSuccess, sendNoContent, sendPaginated } from "../utils/response.utils.js";

/**
 * Get all users (admin only)
 * GET /api/users
 */
export const getUsers = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    role,
    isActive,
    search,
  } = req.query;
  
  // Build filter object
  const filter = {};
  
  if (role) {
    filter.role = role;
  }
  
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }
  
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  
  // Execute queries
  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(filter),
  ]);
  
  sendPaginated(res, {
    data: users,
    page: parseInt(page),
    limit: parseInt(limit),
    total,
  });
});

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  
  sendSuccess(res, { user });
});

/**
 * Update user profile (by the user themselves)
 * PATCH /api/users/profile
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["firstName", "lastName", "avatar"];
  const updates = {};
  
  // Filter allowed fields
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  
  if (Object.keys(updates).length === 0) {
    return next(new AppError("No valid fields to update", 400));
  }
  
  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  
  sendSuccess(res, { user }, "Profile updated successfully");
});

/**
 * Update user by ID (admin only)
 * PATCH /api/users/:id
 */
export const updateUser = catchAsync(async (req, res, next) => {
  const allowedUpdates = ["firstName", "lastName", "role", "isActive", "isEmailVerified"];
  const updates = {};
  
  // Filter allowed fields
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  
  sendSuccess(res, { user }, "User updated successfully");
});

/**
 * Delete user (admin only)
 * DELETE /api/users/:id
 */
export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  
  // Prevent deleting own account
  if (user._id.equals(req.user._id)) {
    return next(new AppError("You cannot delete your own account", 400));
  }
  
  await User.findByIdAndDelete(req.params.id);
  
  sendNoContent(res);
});

/**
 * Deactivate user account (soft delete)
 * PATCH /api/users/:id/deactivate
 */
export const deactivateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  
  user.isActive = false;
  await user.save({ validateBeforeSave: false });
  
  sendSuccess(res, { user }, "User deactivated successfully");
});

/**
 * Activate user account
 * PATCH /api/users/:id/activate
 */
export const activateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  
  user.isActive = true;
  await user.save({ validateBeforeSave: false });
  
  sendSuccess(res, { user }, "User activated successfully");
});
