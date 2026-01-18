/**
 * JWT Utility Functions
 * 
 * Provides token generation and verification utilities
 * for authentication and refresh tokens.
 */

import jwt from "jsonwebtoken";
import config from "../config/index.js";

/**
 * Generate an access token
 * @param {Object} payload - Token payload (usually user ID)
 * @returns {string} JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Generate a refresh token
 * @param {Object} payload - Token payload (usually user ID)
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing accessToken and refreshToken
 */
export const generateTokenPair = (user) => {
  const payload = { id: user._id, email: user.email };
  
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verify an access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

/**
 * Verify a refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret);
};

/**
 * Decode a token without verification
 * Useful for extracting payload from expired tokens
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
