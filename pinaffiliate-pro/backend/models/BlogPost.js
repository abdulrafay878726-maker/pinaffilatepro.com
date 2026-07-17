const mongoose = require("mongoose");
const slugify = require("slugify");

const blogPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, maxlength: 250, default: "" },
    content: { type: String, required: true }, // markdown or rich HTML
    coverImageUrl: { type: String, default: "" },

    category: {
      type: String,
      enum: [
        "Affiliate Marketing", "Pinterest Tips", "Pinterest SEO", "Passive Income",
        "Blogging", "Ecommerce", "AI Tools", "Digital Marketing",
      ],
      required: true,
    },
    tags: [{ type: String, trim: true, lowercase: true }],

    status: { type: String, enum: ["draft", "published"], default: "draft" },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },

    seo: {
      title: { type: String, maxlength: 70, default: "" },
      description: { type: String, maxlength: 160, default: "" },
    },

    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

blogPostSchema.index({ title: "text", excerpt: "text", tags: "text" });

blogPostSchema.pre("validate", function generateSlug(next) {
  if (!this.slug && this.title) {
    this.slug = `${slugify(this.title, { lower: true, strict: true }).slice(0, 70)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;
  }
  next();
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
