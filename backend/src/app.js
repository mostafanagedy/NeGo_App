const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const errorHandler = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const feedRoutes = require("./routes/feed.routes");
const chatRoutes = require("./routes/chat.routes");
const marketplaceRoutes = require("./routes/marketplace.routes");
const groupsRoutes = require("./routes/groups.routes");
const eventsRoutes = require("./routes/events.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NeGo_App API Running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/feed", feedRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/marketplace", marketplaceRoutes);
app.use("/api/v1/groups", groupsRoutes);
app.use("/api/v1/events", eventsRoutes);

app.use(errorHandler);

module.exports = app;
