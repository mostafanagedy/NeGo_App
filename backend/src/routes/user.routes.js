const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const { updateProfileSchema } = require("../validations/user.schema");

const { getProfile, updateProfile } = require("../controllers/user.controller");

router.get("/profile/:username", getProfile);

router.put("/profile", protect, validate(updateProfileSchema), updateProfile);

module.exports = router;
