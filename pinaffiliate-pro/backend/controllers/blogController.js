const asyncHandler = require("express-async-handler");
const BlogPost = require("../models/BlogPost");

// @route  POST /api/blog
const createPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, coverImageUrl, category, tags, seo } = req.body;
  if (!title || !content || !category) {
    res.status(400);
    throw new Error("title, content, and category are required");
  }

  const post = await BlogPost.create({
    author: req.user._id,
    title,
    excerpt,
    content,
    coverImageUrl,
    category,
    tags,
    seo,
  });

  res.status(201).json({ success: true, post });
});

// @route  GET /api/blog
const listPosts = asyncHandler(async (req, res) => {
  const { category, tag, q, featured, page = 1, limit = 12 } = req.query;
  const filter = { status: "published" };
  if (category) filter.category = category;
  if (tag) filter.tags = tag.toLowerCase();
  if (featured) filter.isFeatured = true;
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);
  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .populate("author", "username fullName avatarUrl")
      .sort("-publishedAt")
      .skip(skip)
      .limit(Number(limit)),
    BlogPost.countDocuments(filter),
  ]);

  res.json({ success: true, posts, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @route  GET /api/blog/:slug
const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug }).populate(
    "author",
    "username fullName avatarUrl bio"
  );
  if (!post || post.status !== "published") {
    res.status(404);
    throw new Error("Post not found");
  }

  post.views += 1;
  await post.save();

  const related = await BlogPost.find({
    _id: { $ne: post._id },
    status: "published",
    category: post.category,
  })
    .limit(4)
    .select("title slug coverImageUrl excerpt");

  res.json({ success: true, post, related });
});

// @route  PUT /api/blog/:id
const updatePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (!post.author.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this post");
  }

  ["title", "excerpt", "content", "coverImageUrl", "category", "tags", "seo"].forEach((field) => {
    if (req.body[field] !== undefined) post[field] = req.body[field];
  });

  await post.save();
  res.json({ success: true, post });
});

// @route  PATCH /api/blog/:id/publish
const publishPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (!post.author.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  post.status = "published";
  post.publishedAt = new Date();
  await post.save();

  res.json({ success: true, post });
});

// @route  DELETE /api/blog/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (!post.author.equals(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this post");
  }

  await post.deleteOne();
  res.json({ success: true, message: "Post deleted" });
});

module.exports = { createPost, listPosts, getPostBySlug, updatePost, publishPost, deletePost };
