const mongoose = require("mongoose");

/**
 * One document per click / view event.
 * Kept append-only and lean so daily/monthly analytics can be aggregated
 * with simple $match + $group pipelines (see controllers/analyticsController.js).
 */
const clickEventSchema = new mongoose.Schema(
  {
    pin: { type: mongoose.Schema.Types.ObjectId, ref: "Pin", required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["view", "affiliateClick", "like", "save"], required: true },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

clickEventSchema.index({ owner: 1, type: 1, createdAt: -1 });
clickEventSchema.index({ pin: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model("ClickEvent", clickEventSchema);
