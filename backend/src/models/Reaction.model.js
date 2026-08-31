const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

reactionSchema.index({ post: 1, user: 1 }, { unique: true });
reactionSchema.index({ post: 1, type: 1 });

module.exports = mongoose.model("Reaction", reactionSchema);
