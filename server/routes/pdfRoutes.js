const express = require("express");
const multer = require("multer");
const { searchInPDF } = require("../controllers/pdfController");

const upload = multer({ dest: "shared/" });

const router = express.Router();

router.post("/search", upload.single("pdf"), (req, res, next) => {
  console.log("📩 Received POST /api/pdf/search request");
  next();
}, searchInPDF);

module.exports = router;
