/**
 * Validation Middleware
 * 
 * Request validation using Joi schemas.
 * Provides consistent validation error handling.
 */

import Joi from "joi";
import { AppError } from "../utils/AppError.js";

/**
 * Validate request against a Joi schema
 * @param {Object} schema - Joi schema object with body, query, params properties
 * @returns {Function} Express middleware
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];
    
    // Validate each part of the request
    ["body", "query", "params"].forEach((property) => {
      if (schema[property]) {
        const { error } = schema[property].validate(req[property], {
          abortEarly: false, // Collect all errors
          stripUnknown: true, // Remove unknown keys
        });
        
        if (error) {
          error.details.forEach((detail) => {
            validationErrors.push({
              field: detail.path.join("."),
              message: detail.message.replace(/['"]/g, ""),
              location: property,
            });
          });
        }
      }
    });
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: "Validation failed",
        errors: validationErrors,
      });
    }
    
    next();
  };
};

// ========================
// Common Validation Schemas
// ========================

export const commonSchemas = {
  // MongoDB ObjectId validation
  objectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message("Invalid ID format"),
  
  // Email validation
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .message("Invalid email format"),
  
  // Password validation
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .message("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
  // Pagination
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().default("createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  },
};
