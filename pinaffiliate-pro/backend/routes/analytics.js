const express = require("express");
const ctrl = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.get("/overview", ctrl.getOverview);
router.get("/timeseries", ctrl.getTimeseries);
router.get("/top-links", ctrl.getTopAffiliateLinks);
router.get("/export.csv", ctrl.exportCsvPlaceholder);

module.exports = router;
