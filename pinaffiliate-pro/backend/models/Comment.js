const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["pin", "blogPost"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    body: { type: String, required: true, trim: true, maxlength: 500 },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    isReported: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
