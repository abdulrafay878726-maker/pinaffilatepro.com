const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
} = require("../utils/tokens");

const checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 400;
    throw err;
  }
};

const sendAuthResponse = async (res, user, statusCode = 200) => {
  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());

  user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5); // keep last 5 sessions
  user.lastLoginAt = new Date();
  await user.save();

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  res.status(statusCode).json({
    success: true,
    accessToken,
    user: user.toPublicJSON(),
  });
};

// @route  POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  checkValidation(req);
  const { fullName, username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    res.status(409);
    throw new Error(existing.email === email ? "Email already registered" : "Username already taken");
  }

  // Email verification is a placeholder: token is generated and stored,
  // but no email provider is wired up yet (see EMAIL_PROVIDER_API_KEY in .env).
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    fullName,
    username,
    email,
    password,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  console.log(`[auth] TODO: send verification email to ${email} — token: ${verificationToken}`);

  await sendAuthResponse(res, user, 201);
});

// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  checkValidation(req);
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshTokens");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.status !== "active") {
    res.status(403);
    throw new Error("This account is not active. Contact support.");
  }

  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());
  user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
  user.lastLoginAt = new Date();
  await user.save();

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...refreshCookieOptions,
    maxAge: rememberMe ? refreshCookieOptions.maxAge : 24 * 60 * 60 * 1000, // 1 day if not "remember me"
  });

  res.json({ success: true, accessToken, user: user.toPublicJSON() });
});

// @route  POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    res.status(401);
    throw new Error("Refresh token invalid or expired");
  }

  const user = await User.findById(decoded.sub).select("+refreshTokens");
  if (!user || !user.refreshTokens.includes(token)) {
    res.status(401);
    throw new Error("Refresh token not recognized — please log in again");
  }

  const newAccessToken = signAccessToken(user._id.toString());
  res.json({ success: true, accessToken: newAccessToken, user: user.toPublicJSON() });
});

// @route  POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) {
    await User.updateOne({ refreshTokens: token }, { $pull: { refreshTokens: token } });
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
  res.json({ success: true, message: "Logged out" });
});

// @route  POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way whether or not the email exists,
  // to avoid leaking which addresses are registered.
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Placeholder: swap console.log for a real email provider call.
    console.log(`[auth] TODO: send password reset email to ${email} — token: ${resetToken}`);
  }

  res.json({
    success: true,
    message: "If that email is registered, a reset link has been sent.",
  });
});

// @route  POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    res.status(400);
    throw new Error("Reset link is invalid or has expired");
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = []; // force re-login on all devices
  await user.save();

  res.json({ success: true, message: "Password updated — please log in." });
});

// @route  GET /api/auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    emailVerificationToken: req.params.token,
    emailVerificationExpires: { $gt: Date.now() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    res.status(400);
    throw new Error("Verification link is invalid or has expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Email verified" });
});

// @route  GET /api/auth/google  (placeholder — not wired up)
const googleAuthPlaceholder = asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Google login is not configured yet. Add GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET to enable it.",
  });
});

// @route  GET /api/auth/github  (placeholder — not wired up)
const githubAuthPlaceholder = asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    message: "GitHub login is not configured yet. Add GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET to enable it.",
  });
});

// @route  GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  googleAuthPlaceholder,
  githubAuthPlaceholder,
  getMe,
};
