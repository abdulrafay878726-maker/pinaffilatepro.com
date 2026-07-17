const express = require("express");
const ctrl = require("../controllers/userController");
const { protect, attachUserIfPresent } = require("../middleware/auth");

const router = express.Router();

router.get("/me/dashboard-stats", protect, ctrl.getDashboardStats);
router.put("/me", protect, ctrl.updateMyProfile);
router.get("/:username", attachUserIfPresent, ctrl.getPublicProfile);
router.post("/:username/follow", protect, ctrl.toggleFollow);

module.exports = router;
