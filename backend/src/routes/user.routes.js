const express = require("express");

const router = express.Router();

const { getProfile } = require("../controllers/user.controller")

router.get("/profile/:username",getProfile)

module.exports = router;
