const express = require("express");
const ctrl = require("../controllers/adminController");
const { protect, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/overview", ctrl.getAdminOverview);
router.get("/users", ctrl.listUsers);
router.patch("/users/:id/status", ctrl.updateUserStatus);
router.get("/pins/reported", ctrl.listReportedPins);
router.patch("/pins/:id/moderate", ctrl.moderatePin);
router.patch("/pins/:id/feature", ctrl.toggleFeaturedPin);

module.exports = router;
