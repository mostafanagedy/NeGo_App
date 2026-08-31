const asyncHandler = require("../utils/asyncHandler");
const Listing = require("../models/Listing.model");

const getListings = asyncHandler(async (req, res) => {
  const { category, q, page = 1, limit = 20 } = req.query;
  const filter = { sold: false };
  if (category && category !== "All") filter.category = category;
  if (q) filter.$text = { $search: q };

  const listings = await Listing.find(filter)
    .populate("seller", "firstName lastName username profilePicture")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, data: listings });
});

const getListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate(
    "seller", "firstName lastName username profilePicture"
  );
  if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });
  res.json({ success: true, data: listing });
});

const createListing = asyncHandler(async (req, res) => {
  const { title, description, price, category, condition, location, images } = req.body;
  const listing = await Listing.create({
    seller: req.user._id,
    title, description, price, category, condition, location,
    images: images || [],
  });
  await listing.populate("seller", "firstName lastName username profilePicture");
  res.status(201).json({ success: true, data: listing });
});

const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findOne({ _id: req.params.id, seller: req.user._id });
  if (!listing) return res.status(404).json({ success: false, message: "Not found" });
  Object.assign(listing, req.body);
  await listing.save();
  res.json({ success: true, data: listing });
});

const deleteListing = asyncHandler(async (req, res) => {
  await Listing.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
  res.json({ success: true, message: "Listing deleted" });
});

module.exports = { getListings, getListing, createListing, updateListing, deleteListing };
