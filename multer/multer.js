const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/Images"));
  },
 filename: (req, file, cb) => {
  cb(null, file.originalname); // ✅ Just the original name, no timestamp
}
});

const upload = multer({ storage });

module.exports=upload;
