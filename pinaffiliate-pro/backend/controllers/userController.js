const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Pin = require("../models/Pin");

// @route  GET /api/users/:username
const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!user || (!user.isPublicProfile && req.user?._id.toString() !== user._id.toString())) {
    res.status(404);
    throw new Error("Profile not found");
  }

  const pinCount = await Pin.countDocuments({ owner: user._id, status: "published", visibility: "public" });

  res.json({
    success: true,
    profile: {
      ...user.toPublicJSON(),
      followerCount: user.followers.length,
      followingCount: user.following.length,
      pinCount,
    },
  });
});

// @route  PUT /api/users/me
const updateMyProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "fullName", "bio", "country", "contactEmail", "avatarUrl", "coverImageUrl",
    "social", "theme", "accentColor", "isPublicProfile", "notificationSettings",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });

  await req.user.save();
  res.json({ success: true, user: req.user.toPublicJSON() });
});

// @route  POST /api/users/:username/follow
const toggleFollow = asyncHandler(async (req, res) => {
  const target = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!target) {
    res.status(404);
    throw new Error("User not found");
  }
  if (target._id.equals(req.user._id)) {
    res.status(400);
    throw new Error("You can't follow yourself");
  }

  const alreadyFollowing = target.followers.some((id) => id.equals(req.user._id));

  if (alreadyFollowing) {
    target.followers.pull(req.user._id);
    req.user.following.pull(target._id);
  } else {
    target.followers.push(req.user._id);
    req.user.following.push(target._id);
  }

  await target.save();
  await req.user.save();

  res.json({ success: true, following: !alreadyFollowing, followerCount: target.followers.length });
});

// @route  GET /api/users/me/dashboard-stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalPins, publishedPins, draftPins] = await Promise.all([
    Pin.countDocuments({ owner: req.user._id }),
    Pin.countDocuments({ owner: req.user._id, status: "published" }),
    Pin.countDocuments({ owner: req.user._id, status: "draft" }),
  ]);

  res.json({
    success: true,
    stats: {
      totalPins,
      publishedPins,
      draftPins,
      affiliateClicks: req.user.stats.totalAffiliateClicks,
      totalViews: req.user.stats.totalViews,
      earningsPlaceholder: req.user.stats.earningsPlaceholder,
      followers: req.user.followers.length,
    },
  });
});

module.exports = { getPublicProfile, updateMyProfile, toggleFollow, getDashboardStats };
