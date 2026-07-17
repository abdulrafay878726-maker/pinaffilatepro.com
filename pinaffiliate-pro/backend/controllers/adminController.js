const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Pin = require("../models/Pin");
const Board = require("../models/Board");
const BlogPost = require("../models/BlogPost");

// @route  GET /api/admin/overview
const getAdminOverview = asyncHandler(async (req, res) => {
  const [userCount, pinCount, boardCount, postCount, reportedPins] = await Promise.all([
    User.countDocuments(),
    Pin.countDocuments(),
    Board.countDocuments(),
    BlogPost.countDocuments(),
    Pin.countDocuments({ reportCount: { $gt: 0 } }),
  ]);

  res.json({ success: true, overview: { userCount, pinCount, boardCount, postCount, reportedPins } });
});

// @route  GET /api/admin/users
const listUsers = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 25 } = req.query;
  const filter = q ? { $or: [{ username: new RegExp(q, "i") }, { email: new RegExp(q, "i") }] } : {};

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort("-createdAt").skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, users: users.map((u) => u.toPublicJSON()), total });
});

// @route  PATCH /api/admin/users/:id/status
const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["active", "suspended", "deleted"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, user: user.toPublicJSON() });
});

// @route  GET /api/admin/pins/reported
const listReportedPins = asyncHandler(async (req, res) => {
  const pins = await Pin.find({ reportCount: { $gt: 0 } })
    .sort("-reportCount")
    .populate("owner", "username email");
  res.json({ success: true, pins });
});

// @route  PATCH /api/admin/pins/:id/moderate
const moderatePin = asyncHandler(async (req, res) => {
  const { action } = req.body; // "clearReports" | "archive" | "delete"
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  if (action === "clearReports") pin.reportCount = 0;
  else if (action === "archive") pin.status = "archived";
  else if (action === "delete") {
    await pin.deleteOne();
    return res.json({ success: true, message: "Pin deleted" });
  }

  await pin.save();
  res.json({ success: true, pin });
});

// @route  PATCH /api/admin/pins/:id/feature
const toggleFeaturedPin = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }
  pin.isFeatured = !pin.isFeatured;
  await pin.save();
  res.json({ success: true, pin });
});

module.exports = {
  getAdminOverview, listUsers, updateUserStatus, listReportedPins, moderatePin, toggleFeaturedPin,
};
