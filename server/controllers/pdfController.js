const path = require("path");
const { processPDFSearch, processPDFSummary } = require("../services/pdfService");
const searchInPDF = async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);
    const query = req.body.query;
    const result = await processPDFSearch(filePath, query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal error while processing PDF" });
  }
};

const summarizePDF = async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);
    const result = await processPDFSummary(filePath);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal error while summarizing PDF" });
  }
};

module.exports = {
  searchInPDF,
  summarizePDF,
};
