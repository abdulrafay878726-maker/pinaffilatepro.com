const express = require("express");
const ctrl = require("../controllers/blogController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", ctrl.listPosts);
router.get("/:slug", ctrl.getPostBySlug);
router.post("/", protect, ctrl.createPost);
router.put("/:id", protect, ctrl.updatePost);
router.patch("/:id/publish", protect, ctrl.publishPost);
router.delete("/:id", protect, ctrl.deletePost);

module.exports = router;
