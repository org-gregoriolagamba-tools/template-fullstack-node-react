/**
 * User Validation Schemas
 * 
 * Joi validation schemas for user management endpoints.
 */

import Joi from "joi";

/**
 * User ID parameter validation
 */
export const userIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid user ID format",
        "any.required": "User ID is required",
      }),
  }),
};

/**
 * Update profile validation schema (for users updating their own profile)
 */
export const updateProfileSchema = {
  body: Joi.object({
    firstName: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .messages({
        "string.min": "First name is required",
        "string.max": "First name cannot exceed 50 characters",
      }),
    lastName: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .messages({
        "string.min": "Last name is required",
        "string.max": "Last name cannot exceed 50 characters",
      }),
    avatar: Joi.string()
      .uri()
      .allow(null, "")
      .messages({
        "string.uri": "Avatar must be a valid URL",
      }),
  }).min(1).messages({
    "object.min": "At least one field is required to update",
  }),
};

/**
 * Update user validation schema (admin updating any user)
 */
export const updateUserSchema = {
  body: Joi.object({
    firstName: Joi.string()
      .trim()
      .min(1)
      .max(50),
    lastName: Joi.string()
      .trim()
      .min(1)
      .max(50),
    role: Joi.string()
      .valid("user", "admin", "moderator"),
    isActive: Joi.boolean(),
    isEmailVerified: Joi.boolean(),
  }).min(1).messages({
    "object.min": "At least one field is required to update",
  }),
};

/**
 * Query parameters validation for listing users
 */
export const getUsersQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid("createdAt", "email", "firstName", "lastName").default("createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    role: Joi.string().valid("user", "admin", "moderator"),
    isActive: Joi.string().valid("true", "false"),
    search: Joi.string().max(100),
  }),
};
