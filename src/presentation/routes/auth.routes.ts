import express from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middlewares/auth.middleware";
import { validate, validateBody } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyTokenSchema,
} from "../../app/validations/auth.validation";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", validateBody(registerSchema), AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login an existing user
 * @access  Public
 */
router.post("/login", validateBody(loginSchema), AuthController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", authMiddleware, AuthController.profile);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify JWT token
 * @access  Public
 */
router.post("/verify", validate(verifyTokenSchema), AuthController.verify);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Public
 */
router.post("/refresh", validate(refreshTokenSchema), AuthController.refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post("/logout", authMiddleware, AuthController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info (alias for profile)
 * @access  Private
 */
router.get("/me", authMiddleware, AuthController.profile);

/**
 * @route   GET /api/auth/status
 * @desc    Check authentication status
 * @access  Optional Auth
 */
router.get("/status", optionalAuthMiddleware, (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "User is authenticated",
      authenticated: true,
      user: {
        id: req.user.user.id,
        email: req.user.user.email,
        firstName: req.user.user.firstName,
        lastName: req.user.user.lastName,
      },
    });
  } else {
    res.status(200).json({
      success: true,
      message: "User is not authenticated",
      authenticated: false,
    });
  }
});

export default router;
