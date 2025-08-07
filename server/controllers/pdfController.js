const path = require("path");
const { processPDFSearch } = require("../services/pdfService");

const searchInPDF = async (req, res) => {
  try {
    console.log("📂 Entered Controller: searchInPDF");

    const filePath = path.resolve(req.file.path);
    const query = req.body.query;

    console.log("📎 File saved to:", filePath);
    console.log("🔍 Query received:", query);

    const result = await processPDFSearch(filePath, query);
    console.log("📤 Sending back result to client...");
    res.json(result);
  } catch (err) {
    console.error("❌ Error in controller searchInPDF:", err);
    res.status(500).json({ error: "Internal error while processing PDF" });
  }
};

module.exports = {
  searchInPDF
};
