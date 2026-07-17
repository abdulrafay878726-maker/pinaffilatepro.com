const express = require("express");
const ctrl = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/:targetType/:targetId", ctrl.listComments);
router.post("/:targetType/:targetId", protect, ctrl.addComment);
router.delete("/:id", protect, ctrl.deleteComment);

module.exports = router;
