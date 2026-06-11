const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const errorHandelr = require("../src/middlewares/error.middleware")

app.use(helmet());

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());


const authRoutes = require("./routes/auth.routes");
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NeGo_App API Running",
  });
});

const userRouters =require("./routes/user.routes")

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRouters);

app.use(errorHandelr);


module.exports = app;
