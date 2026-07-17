const express = require("express");
const ctrl = require("../controllers/pinController");
const { protect, attachUserIfPresent } = require("../middleware/auth");

const router = express.Router();

router.get("/", listPinsWrap);
router.get("/me", protect, ctrl.listMyPins);
router.get("/:slug", attachUserIfPresent, ctrl.getPinBySlug);

router.post("/", protect, ctrl.createPin);
router.put("/:id", protect, ctrl.updatePin);
router.patch("/:id/publish", protect, ctrl.publishPin);
router.delete("/:id", protect, ctrl.deletePin);

router.post("/:id/click", ctrl.trackAffiliateClick); // public — visitors don't need an account to click "Buy Now"
router.post("/:id/like", protect, ctrl.toggleLike);
router.post("/:id/save", protect, ctrl.toggleSave);
router.post("/:id/report", protect, ctrl.reportPin);

// small wrapper so /:slug doesn't shadow the list route
function listPinsWrap(req, res, next) {
  return ctrl.listPins(req, res, next);
}

module.exports = router;
