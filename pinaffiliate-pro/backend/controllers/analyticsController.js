const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ClickEvent = require("../models/ClickEvent");
const Pin = require("../models/Pin");

const dayFormat = "%Y-%m-%d";
const monthFormat = "%Y-%m";

// @route  GET /api/analytics/overview
const getOverview = asyncHandler(async (req, res) => {
  const ownerId = new mongoose.Types.ObjectId(req.user._id);

  const [totals, topPins, topCategories] = await Promise.all([
    ClickEvent.aggregate([
      { $match: { owner: ownerId } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
    Pin.find({ owner: ownerId, status: "published" })
      .sort("-views")
      .limit(5)
      .select("title slug views affiliate.clickCount"),
    Pin.aggregate([
      { $match: { owner: ownerId, status: "published" } },
      { $group: { _id: "$category", views: { $sum: "$views" }, clicks: { $sum: "$affiliate.clickCount" } } },
      { $sort: { views: -1 } },
      { $limit: 6 },
    ]),
  ]);

  const totalsMap = totals.reduce((acc, t) => ({ ...acc, [t._id]: t.count }), {});
  const views = totalsMap.view || 0;
  const affiliateClicks = totalsMap.affiliateClick || 0;

  res.json({
    success: true,
    overview: {
      views,
      affiliateClicks,
      ctr: views ? Number(((affiliateClicks / views) * 100).toFixed(2)) : 0,
      likes: totalsMap.like || 0,
      saves: totalsMap.save || 0,
      topPins,
      topCategories,
    },
  });
});

// @route  GET /api/analytics/timeseries?range=daily|monthly&type=view|affiliateClick
const getTimeseries = asyncHandler(async (req, res) => {
  const ownerId = new mongoose.Types.ObjectId(req.user._id);
  const { range = "daily", type = "view" } = req.query;
  const format = range === "monthly" ? monthFormat : dayFormat;

  const since = new Date();
  since.setDate(since.getDate() - (range === "monthly" ? 365 : 30));

  const data = await ClickEvent.aggregate([
    { $match: { owner: ownerId, type, createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format, date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, range, type, series: data.map((d) => ({ date: d._id, count: d.count })) });
});

// @route  GET /api/analytics/top-links
const getTopAffiliateLinks = asyncHandler(async (req, res) => {
  const ownerId = new mongoose.Types.ObjectId(req.user._id);
  const pins = await Pin.find({ owner: ownerId, status: "published" })
    .sort("-affiliate.clickCount")
    .limit(10)
    .select("title slug affiliate.url affiliate.clickCount affiliate.conversionPlaceholder");

  res.json({ success: true, links: pins });
});

// @route  GET /api/analytics/export.csv  (placeholder)
const exportCsvPlaceholder = asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    message: "CSV export is a placeholder in this build — wire up json2csv or a queue-based export job here.",
  });
});

module.exports = { getOverview, getTimeseries, getTopAffiliateLinks, exportCsvPlaceholder };
