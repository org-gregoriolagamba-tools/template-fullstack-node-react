/**
 * Authentication Validation Schemas
 * 
 * Joi validation schemas for authentication endpoints.
 */

import Joi from "joi";
import { commonSchemas } from "../middleware/validation.middleware.js";

/**
 * Register validation schema
 */
export const registerSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "any.required": "Password is required",
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
      }),
    firstName: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        "string.min": "First name is required",
        "string.max": "First name cannot exceed 50 characters",
        "any.required": "First name is required",
      }),
    lastName: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        "string.min": "Last name is required",
        "string.max": "Last name cannot exceed 50 characters",
        "any.required": "Last name is required",
      }),
  }),
};

/**
 * Login validation schema
 */
export const loginSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string()
      .required()
      .messages({
        "any.required": "Password is required",
      }),
  }),
};

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = {
  body: Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        "any.required": "Refresh token is required",
      }),
  }),
};

/**
 * Update password validation schema
 */
export const updatePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        "any.required": "Current password is required",
      }),
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        "string.min": "New password must be at least 8 characters",
        "string.pattern.base": "New password must contain at least one uppercase letter, one lowercase letter, and one number",
        "any.required": "New password is required",
      }),
    confirmNewPassword: Joi.string()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
      }),
  }),
};
