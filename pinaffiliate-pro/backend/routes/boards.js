const express = require("express");
const ctrl = require("../controllers/boardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", ctrl.listBoards);
router.get("/:slug", ctrl.getBoardBySlug);
router.post("/", protect, ctrl.createBoard);
router.put("/:id", protect, ctrl.updateBoard);
router.delete("/:id", protect, ctrl.deleteBoard);
router.post("/:id/follow", protect, ctrl.toggleFollowBoard);

module.exports = router;
