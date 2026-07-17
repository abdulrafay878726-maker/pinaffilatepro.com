const asyncHandler = require("express-async-handler");
const Board = require("../models/Board");
const Pin = require("../models/Pin");

// @route  POST /api/boards
const createBoard = asyncHandler(async (req, res) => {
  const { name, description, coverImageUrl, privacy, categories } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Board name is required");
  }

  const board = await Board.create({
    owner: req.user._id,
    name,
    description,
    coverImageUrl,
    privacy,
    categories,
  });

  res.status(201).json({ success: true, board });
});

// @route  GET /api/boards?owner=username
const listBoards = asyncHandler(async (req, res) => {
  const { owner } = req.query;
  const filter = { privacy: "public" };
  if (owner) filter.owner = owner;

  const boards = await Board.find(filter).populate("owner", "username avatarUrl").sort("-createdAt");
  res.json({ success: true, boards });
});

// @route  GET /api/boards/:slug
const getBoardBySlug = asyncHandler(async (req, res) => {
  const board = await Board.findOne({ slug: req.params.slug }).populate("owner", "username avatarUrl");
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  const pins = await Pin.find({ board: board._id, status: "published", visibility: "public" }).sort(
    "-publishedAt"
  );

  res.json({ success: true, board, pins });
});

// @route  PUT /api/boards/:id
const updateBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }
  if (!board.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to edit this board");
  }

  ["name", "description", "coverImageUrl", "privacy", "categories"].forEach((field) => {
    if (req.body[field] !== undefined) board[field] = req.body[field];
  });

  await board.save();
  res.json({ success: true, board });
});

// @route  DELETE /api/boards/:id
const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }
  if (!board.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to delete this board");
  }

  await Pin.updateMany({ board: board._id }, { $set: { board: null } });
  await board.deleteOne();
  res.json({ success: true, message: "Board deleted" });
});

// @route  POST /api/boards/:id/follow
const toggleFollowBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  const following = board.followers.some((id) => id.equals(req.user._id));
  if (following) {
    board.followers.pull(req.user._id);
  } else {
    board.followers.push(req.user._id);
  }
  await board.save();

  res.json({ success: true, following: !following, followerCount: board.followers.length });
});

module.exports = { createBoard, listBoards, getBoardBySlug, updateBoard, deleteBoard, toggleFollowBoard };
