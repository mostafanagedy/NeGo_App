const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture", "Vehicles", "Books", "Sports", "Other"],
    },
    condition: { type: String, enum: ["New", "Like New", "Good", "Fair"], default: "Good" },
    images: [{ type: String }],
    location: { type: String, default: "" },
    sold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

listingSchema.index({ category: 1, createdAt: -1 });
listingSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Listing", listingSchema);
