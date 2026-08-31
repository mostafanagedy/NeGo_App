const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const { getListings, getListing, createListing, updateListing, deleteListing } = require("../controllers/marketplace.controller");

router.get("/", getListings);
router.get("/:id", getListing);
router.post("/", protect, createListing);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);

module.exports = router;
