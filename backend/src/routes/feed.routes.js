const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const { getFeed } = require("../controllers/feed.controller");

router.get("/", protect, getFeed);

module.exports = router;
