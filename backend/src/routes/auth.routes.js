/**
 * Authentication Routes
 * 
 * Defines routes for user authentication operations.
 */

import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updatePassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { authLimiter, registrationLimiter } from "../middleware/rateLimiter.middleware.js";
import { registerSchema, loginSchema, refreshTokenSchema, updatePasswordSchema } from "../validations/auth.validation.js";

const router = Router();

// Public routes
router.post("/register", registrationLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

// Protected routes
router.use(authenticate); // All routes below require authentication
router.get("/me", getMe);
router.post("/logout", logout);
router.patch("/update-password", validate(updatePasswordSchema), updatePassword);

export default router;
