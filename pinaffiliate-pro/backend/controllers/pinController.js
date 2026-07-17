const asyncHandler = require("express-async-handler");
const Pin = require("../models/Pin");
const User = require("../models/User");
const ClickEvent = require("../models/ClickEvent");

const PIN_PUBLIC_QUERY = { status: "published", visibility: "public" };

// @route  POST /api/pins
const createPin = asyncHandler(async (req, res) => {
  const {
    imageUrl, title, description, category, tags, keywords, board,
    affiliate, seo, visibility, isFeatured, scheduledFor,
  } = req.body;

  if (!imageUrl || !title || !affiliate?.url) {
    res.status(400);
    throw new Error("imageUrl, title, and affiliate.url are required");
  }

  const isScheduled = Boolean(scheduledFor) && new Date(scheduledFor) > new Date();

  const pin = await Pin.create({
    owner: req.user._id,
    board: board || null,
    imageUrl,
    title,
    description,
    category,
    tags,
    keywords,
    affiliate,
    seo,
    visibility: visibility || "public",
    isFeatured: Boolean(isFeatured) && req.user.role === "admin" ? isFeatured : false,
    scheduledFor: isScheduled ? scheduledFor : null,
    status: isScheduled ? "scheduled" : "draft",
  });

  await User.updateOne({ _id: req.user._id }, { $inc: { "stats.totalPins": 1 } });

  res.status(201).json({ success: true, pin });
});

// @route  GET /api/pins  (feed — published + public, with filters)
const listPins = asyncHandler(async (req, res) => {
  const { category, tag, owner, board, q, page = 1, limit = 20, sort = "-publishedAt" } = req.query;

  const filter = { ...PIN_PUBLIC_QUERY };
  if (category) filter.category = category;
  if (tag) filter.tags = tag.toLowerCase();
  if (owner) filter.owner = owner;
  if (board) filter.board = board;
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);

  const [pins, total] = await Promise.all([
    Pin.find(filter)
      .populate("owner", "username fullName avatarUrl")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Pin.countDocuments(filter),
  ]);

  res.json({ success: true, pins, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @route  GET /api/pins/me  (own pins, any status — dashboard)
const listMyPins = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = { owner: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [pins, total] = await Promise.all([
    Pin.find(filter).sort("-createdAt").skip(skip).limit(Number(limit)),
    Pin.countDocuments(filter),
  ]);

  res.json({ success: true, pins, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @route  GET /api/pins/:slug
const getPinBySlug = asyncHandler(async (req, res) => {
  const pin = await Pin.findOne({ slug: req.params.slug }).populate(
    "owner",
    "username fullName avatarUrl bio"
  );

  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  const isOwner = req.user && pin.owner._id.equals(req.user._id);
  if (pin.visibility === "private" && !isOwner) {
    res.status(404);
    throw new Error("Pin not found");
  }

  // Fire-and-forget view tracking (skip when the owner previews their own pin)
  if (!isOwner) {
    pin.views += 1;
    await pin.save();
    await ClickEvent.create({ pin: pin._id, owner: pin.owner._id, type: "view" });
    await User.updateOne({ _id: pin.owner._id }, { $inc: { "stats.totalViews": 1 } });
  }

  const relatedPins = await Pin.find({
    ...PIN_PUBLIC_QUERY,
    _id: { $ne: pin._id },
    $or: [{ category: pin.category }, { tags: { $in: pin.tags } }],
  })
    .limit(8)
    .populate("owner", "username avatarUrl");

  res.json({ success: true, pin, relatedPins });
});

// @route  PUT /api/pins/:id
const updatePin = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }
  if (!pin.owner.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this pin");
  }

  const editable = [
    "imageUrl", "title", "description", "category", "tags", "keywords", "board",
    "affiliate", "seo", "visibility", "scheduledFor",
  ];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) pin[field] = req.body[field];
  });

  if (req.user.role === "admin" && req.body.isFeatured !== undefined) {
    pin.isFeatured = req.body.isFeatured;
  }

  await pin.save();
  res.json({ success: true, pin });
});

// @route  PATCH /api/pins/:id/publish
const publishPin = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }
  if (!pin.owner.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  pin.status = "published";
  pin.publishedAt = new Date();
  await pin.save();

  res.json({ success: true, pin });
});

// @route  DELETE /api/pins/:id
const deletePin = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }
  if (!pin.owner.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this pin");
  }

  await pin.deleteOne();
  await User.updateOne({ _id: pin.owner }, { $inc: { "stats.totalPins": -1 } });
  res.json({ success: true, message: "Pin deleted" });
});

// @route  POST /api/pins/:id/click  (affiliate buy-button click)
const trackAffiliateClick = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  pin.affiliate.clickCount += 1;
  await pin.save();

  await ClickEvent.create({
    pin: pin._id,
    owner: pin.owner,
    type: "affiliateClick",
    referrer: req.headers.referer || "",
    userAgent: req.headers["user-agent"] || "",
  });

  await User.updateOne({ _id: pin.owner }, { $inc: { "stats.totalAffiliateClicks": 1 } });

  res.json({ success: true, redirectUrl: pin.affiliate.url });
});

// @route  POST /api/pins/:id/like
const toggleLike = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  const liked = pin.likes.some((id) => id.equals(req.user._id));
  if (liked) {
    pin.likes.pull(req.user._id);
  } else {
    pin.likes.push(req.user._id);
    await User.updateOne({ _id: pin.owner }, { $inc: { "stats.totalLikes": 1 } });
  }
  await pin.save();

  res.json({ success: true, liked: !liked, likeCount: pin.likes.length });
});

// @route  POST /api/pins/:id/save
const toggleSave = asyncHandler(async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }

  const saved = pin.saves.some((id) => id.equals(req.user._id));
  if (saved) {
    pin.saves.pull(req.user._id);
  } else {
    pin.saves.push(req.user._id);
    await User.updateOne({ _id: pin.owner }, { $inc: { "stats.totalSaves": 1 } });
  }
  await pin.save();

  res.json({ success: true, saved: !saved, saveCount: pin.saves.length });
});

// @route  POST /api/pins/:id/report
const reportPin = asyncHandler(async (req, res) => {
  const pin = await Pin.findByIdAndUpdate(req.params.id, { $inc: { reportCount: 1 } }, { new: true });
  if (!pin) {
    res.status(404);
    throw new Error("Pin not found");
  }
  res.json({ success: true, message: "Thanks — this pin has been reported for review." });
});

module.exports = {
  createPin, listPins, listMyPins, getPinBySlug, updatePin,
  publishPin, deletePin, trackAffiliateClick, toggleLike, toggleSave, reportPin,
};
