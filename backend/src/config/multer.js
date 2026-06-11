const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,"uploads/")
  },
  filename: (req, file, cb) => {
    const uniqeName = Date.now() +
      "_" +
      Math.round(Math.random() * 1e9)
    cb(
      null,
        uniqeName+path.extname(file.originalname)
      )

  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files are allowed"
      ),
      fals
    );
  }
}
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fieldSize: 5 * 1024 * 1024,

  },
})
module.exports=upload
