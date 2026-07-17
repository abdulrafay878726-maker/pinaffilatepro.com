const mongoose = require("mongoose");
const slugify = require("slugify");

const boardSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true, maxlength: 300, default: "" },
    coverImageUrl: { type: String, default: "" },
    privacy: { type: String, enum: ["public", "private"], default: "public" },
    categories: [{ type: String, trim: true }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pinCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

boardSchema.pre("validate", function generateSlug(next) {
  if (!this.slug && this.name) {
    this.slug = `${slugify(this.name, { lower: true, strict: true }).slice(0, 50)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  }
  next();
});

module.exports = mongoose.model("Board", boardSchema);
