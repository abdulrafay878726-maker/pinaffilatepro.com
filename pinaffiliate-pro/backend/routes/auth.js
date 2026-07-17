const express = require("express");
const { body } = require("express-validator");
const ctrl = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3–30 characters")
      .matches(/^[a-z0-9_]+$/)
      .withMessage("Username may only contain lowercase letters, numbers, and underscores"),
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  ctrl.register
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  ctrl.login
);

router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);

router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().withMessage("A valid email is required").normalizeEmail()],
  ctrl.forgotPassword
);

router.post(
  "/reset-password/:token",
  authLimiter,
  [body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")],
  ctrl.resetPassword
);

router.get("/verify-email/:token", ctrl.verifyEmail);

// OAuth placeholders — return 501 until real credentials are configured
router.get("/google", ctrl.googleAuthPlaceholder);
router.get("/github", ctrl.githubAuthPlaceholder);

router.get("/me", protect, ctrl.getMe);

module.exports = router;
