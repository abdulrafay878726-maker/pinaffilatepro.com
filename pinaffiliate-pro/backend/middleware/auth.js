const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { verifyAccessToken } = require("../utils/tokens");

/**
 * Requires a valid access token in the Authorization header:
 *   Authorization: Bearer <token>
 * Attaches the authenticated user to req.user (without password/tokens).
 */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no access token provided");
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub);

    if (!user || user.status !== "active") {
      res.status(401);
      throw new Error("Not authorized — user no longer active");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized — invalid or expired token");
  }
});

/** Restricts a route to admin users. Must run after `protect`. */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }
  next();
};

/**
 * Optional auth: attaches req.user if a valid token is present,
 * but never blocks the request. Useful for public pin/board pages
 * that show extra controls (like/save state) to logged-in visitors.
 */
const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub);
    if (user && user.status === "active") req.user = user;
  } catch {
    // Silently ignore — request proceeds unauthenticated
  }
  next();
});

module.exports = { protect, requireAdmin, attachUserIfPresent };
