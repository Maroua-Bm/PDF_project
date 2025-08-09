const express = require("express");
const cors = require("cors");
const path = require("path");
const pdfRoutes = require("./routes/pdfRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "shared")));
console.log("Registering /api/pdf routes...");
app.use("/api/pdf", pdfRoutes);
app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
  console.log("Highlighted PDFs will be available at http://localhost:5001/static/highlighted.pdf");
});