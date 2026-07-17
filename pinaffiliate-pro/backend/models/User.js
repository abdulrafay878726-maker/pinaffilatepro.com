const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const socialLinksSchema = new mongoose.Schema(
  {
    website: { type: String, default: "" },
    pinterest: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  { _id: false }
);

const notificationSettingsSchema = new mongoose.Schema(
  {
    emailOnFollower: { type: Boolean, default: true },
    emailOnComment: { type: Boolean, default: true },
    emailOnLike: { type: Boolean, default: false },
    emailWeeklyDigest: { type: Boolean, default: true },
    pushEnabled: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9_]+$/, "Username may only contain lowercase letters, numbers, and underscores"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: { type: String, required: true, minlength: 8, select: false },

    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "suspended", "deleted"], default: "active" },

    avatarUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    bio: { type: String, maxlength: 300, default: "" },
    country: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    social: { type: socialLinksSchema, default: () => ({}) },

    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    accentColor: { type: String, default: "#FF6B5B" },
    isPublicProfile: { type: Boolean, default: true },
    notificationSettings: { type: notificationSettingsSchema, default: () => ({}) },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    stats: {
      totalPins: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 },
      totalLikes: { type: Number, default: 0 },
      totalSaves: { type: Number, default: 0 },
      totalClicks: { type: Number, default: 0 },
      totalAffiliateClicks: { type: Number, default: 0 },
      earningsPlaceholder: { type: Number, default: 0 },
    },

    // Auth / verification
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    refreshTokens: [{ type: String, select: false }],

    // OAuth placeholders — populated only once real credentials are wired in
    googleId: { type: String, default: null, select: false },
    githubId: { type: String, default: null, select: false },

    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  delete obj.googleId;
  delete obj.githubId;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
