const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: "", maxlength: 1000 },
    cover: { type: String, default: "" },
    privacy: { type: String, enum: ["public", "private"], default: "public" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: {
      type: String,
      enum: ["Technology", "Sports", "Art", "Music", "Gaming", "Education", "Business", "Other"],
      default: "Other",
    },
  },
  { timestamps: true }
);

groupSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Group", groupSchema);
