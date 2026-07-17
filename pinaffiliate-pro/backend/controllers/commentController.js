const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");

// @route  GET /api/comments/:targetType/:targetId
const listComments = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.params;
  const comments = await Comment.find({ targetType, targetId })
    .populate("author", "username fullName avatarUrl")
    .sort("-createdAt");
  res.json({ success: true, comments });
});

// @route  POST /api/comments/:targetType/:targetId
const addComment = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.params;
  const { body, parentComment } = req.body;

  if (!["pin", "blogPost"].includes(targetType)) {
    res.status(400);
    throw new Error("Invalid comment target");
  }
  if (!body?.trim()) {
    res.status(400);
    throw new Error("Comment cannot be empty");
  }

  const comment = await Comment.create({
    author: req.user._id,
    targetType,
    targetId,
    body: body.trim(),
    parentComment: parentComment || null,
  });

  await comment.populate("author", "username fullName avatarUrl");
  res.status(201).json({ success: true, comment });
});

// @route  DELETE /api/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  if (!comment.author.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this comment");
  }

  await comment.deleteOne();
  res.json({ success: true, message: "Comment deleted" });
});

module.exports = { listComments, addComment, deleteComment };
