const express = require("express");
const multer = require("multer");
const { searchInPDF, summarizePDF } = require("../controllers/pdfController");
const upload = multer({ dest: "shared/" }); 
const router = express.Router();

router.post("/search", upload.single("pdf"), searchInPDF);
router.post("/summarize", upload.single("pdf"), summarizePDF);

module.exports = router;
