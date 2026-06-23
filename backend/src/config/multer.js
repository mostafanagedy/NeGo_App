const multer = require("multer");
const path = require("path");
const fs = require("fs"); // 1. قمنا باستدعاء نظام الملفات لإدارة المجلدات

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";

    // 2. التحقق من وجود المجلد، وإذا لم يكن موجوداً يتم إنشاؤه تلقائياً
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqeName = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, uniqeName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // تم تصحيح الخطأ الإملائي هنا أيضاً (من fals إلى false)
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    // ملاحظة: إذا كنت تقصد حجم الملف، يفضل استخدام fileSize وليس fieldSize
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
