var express = require("express");
var router = express.Router();
var multer = require("multer");
const fs = require("fs");
const mime = require("mime-types");
const path = require("path");

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
      let ext = mime.extension(file.mimetype);
      cb(null, `${file.fieldname}-${Date.now()}${ext ? `.${ext}` : ""}`);
    }
  }),
  limits: {
    fileSize: 5000
  }
}).single("file");

router.post("/", fileUpload, function(req, res) {
  const file = req.file;
  if (!file) {
    throw Error("No file was selected");
  }
  const fileStream = fs.createWriteStream(file.path, {
    start: 0,
    flags: "r+"
  });
  fileStream.write("CorruptIt", err => {
    fileStream.end();
    if (err) res.redirect("/?result=server-error");
    res.download(path.resolve(process.cwd(), file.path));
  });
});

module.exports = router;
