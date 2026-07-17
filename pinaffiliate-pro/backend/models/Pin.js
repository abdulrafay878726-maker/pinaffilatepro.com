const mongoose = require("mongoose");
const slugify = require("slugify");

const affiliateSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    buttonText: {
      type: String,
      enum: ["Buy Now", "Shop Now", "Get Deal", "View Product", "Learn More"],
      default: "Buy Now",
    },
    buttonColor: { type: String, default: "#FF6B5B" },
    buttonIcon: { type: String, default: "shopping-bag" }, // lucide-react icon name
    openInNewTab: { type: Boolean, default: true },
    nofollow: { type: Boolean, default: true },
    sponsored: { type: Boolean, default: true },
    clickCount: { type: Number, default: 0 },
    conversionPlaceholder: { type: Number, default: 0 },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    title: { type: String, maxlength: 70, default: "" },
    description: { type: String, maxlength: 160, default: "" },
    altText: { type: String, default: "" },
  },
  { _id: false }
);

const pinSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", default: null },

    imageUrl: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: "" },

    category: {
      type: String,
      enum: [
        "Affiliate Marketing", "Home Decor", "Fashion", "Beauty", "Food & Drink",
        "Travel", "DIY & Crafts", "Technology", "Fitness", "Finance", "Other",
      ],
      default: "Other",
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    keywords: [{ type: String, trim: true, lowercase: true }],

    slug: { type: String, unique: true, index: true },

    scheduledFor: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    status: { type: String, enum: ["draft", "scheduled", "published", "archived"], default: "draft" },
    visibility: { type: String, enum: ["public", "unlisted", "private"], default: "public" },
    isFeatured: { type: Boolean, default: false },

    affiliate: { type: affiliateSchema, required: true },
    seo: { type: seoSchema, default: () => ({}) },

    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pinSchema.index({ title: "text", description: "text", tags: "text", keywords: "text" });
pinSchema.index({ status: 1, visibility: 1, publishedAt: -1 });

pinSchema.pre("validate", async function generateSlug(next) {
  if (!this.slug && this.title) {
    const base = slugify(this.title, { lower: true, strict: true }).slice(0, 60);
    this.slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
  }
  next();
});

module.exports = mongoose.model("Pin", pinSchema);
