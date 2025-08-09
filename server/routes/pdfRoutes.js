// backend/routes/pdfroutes.js
const express = require("express");
const multer = require("multer");
const { searchInPDF, summarizePDF } = require("../controllers/pdfController");

const upload = multer({ dest: "shared/" }); // Files will be saved in /shared
const router = express.Router();

// Search: upload PDF + query
router.post("/search", upload.single("pdf"), searchInPDF);

// Summarize: upload PDF again
router.post("/summarize", upload.single("pdf"), summarizePDF);

module.exports = router;
