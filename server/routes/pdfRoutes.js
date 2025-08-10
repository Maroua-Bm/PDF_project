const express = require("express");
const path = require("path");
const multer = require("multer");
const { searchInPDF, summarizePDF } = require("../controllers/pdfController");

const storage = multer.diskStorage({
  destination: "shared/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post("/search", upload.single("pdf"), searchInPDF);
router.post("/summarize", upload.single("pdf"), summarizePDF);

module.exports = router;
