/**
 * User Routes
 * 
 * Defines routes for user management operations.
 */

import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateProfile,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { updateProfileSchema, updateUserSchema, userIdSchema } from "../validations/user.validation.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// User profile routes
router.patch("/profile", validate(updateProfileSchema), updateProfile);

// Admin-only routes
router.get("/", authorize("admin"), getUsers);
router.get("/:id", authorize("admin"), validate(userIdSchema), getUserById);
router.patch("/:id", authorize("admin"), validate(userIdSchema), validate(updateUserSchema), updateUser);
router.delete("/:id", authorize("admin"), validate(userIdSchema), deleteUser);
router.patch("/:id/deactivate", authorize("admin"), validate(userIdSchema), deactivateUser);
router.patch("/:id/activate", authorize("admin"), validate(userIdSchema), activateUser);

export default router;
