const express = require("express");
const cors = require("cors");
const path = require("path");
const pdfRoutes = require("./routes/pdfRoutes");

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// ✅ Serve the "shared" folder where highlighted.pdf is stored
app.use("/static", express.static(path.join(__dirname, "shared")));

console.log("📥 Registering /api/pdf routes...");
app.use("/api/pdf", pdfRoutes);

// Start the server
app.listen(5001, () => {
  console.log("🚀 Server running on http://localhost:5001");
  console.log("📄 Highlighted PDFs will be available at http://localhost:5001/static/highlighted.pdf");
});
