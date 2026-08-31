const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const { getEvents, getMyEvents, createEvent, attendEvent, leaveEvent } = require("../controllers/events.controller");

router.get("/", getEvents);
router.get("/my", protect, getMyEvents);
router.post("/", protect, createEvent);
router.put("/:id/attend", protect, attendEvent);
router.put("/:id/leave", protect, leaveEvent);

module.exports = router;
