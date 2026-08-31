const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const { getGroups, getMyGroups, createGroup, joinGroup, leaveGroup, deleteGroup } = require("../controllers/groups.controller");

router.get("/", getGroups);
router.get("/my", protect, getMyGroups);
router.post("/", protect, createGroup);
router.put("/:id/join", protect, joinGroup);
router.put("/:id/leave", protect, leaveGroup);
router.delete("/:id", protect, deleteGroup);

module.exports = router;
