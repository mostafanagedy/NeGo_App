const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: "", maxlength: 2000 },
    cover: { type: String, default: "" },
    category: { type: String, enum: ["Technology", "Sports", "Art", "Music", "Gaming", "Education", "Business", "Social", "Other"], default: "Other" },
    location: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    privacy: { type: String, enum: ["public", "private"], default: "public" },
  },
  { timestamps: true }
);

eventSchema.index({ startDate: 1 });
eventSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Event", eventSchema);
