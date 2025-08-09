const { execFile } = require("child_process");

const GEMINI_API_KEY = "AIzaSyDECTvPfUQL208OfKS_Jsyfz0E2PLmuFAE";

const processPDFSearch = (filePath, query) => {
  console.log("🧠 In Service: Starting PDF processing with Python...");
  return new Promise((resolve, reject) => {
    console.log("📨 Calling Python script with:");
    console.log("  📄 FilePath:", filePath);
    console.log("  🧵 Query:", query);

    execFile("python", ["../core/main.py", filePath, query], (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Python execution error:");
        console.error("stderr:", stderr);
        console.error("error:", err.message);
        return reject("Failed to process PDF (Python error)");
      }

      console.log("✅ Python returned output:");
      console.log(stdout);

      try {
        const result = JSON.parse(stdout);
        console.log("✅ Parsed Python JSON result:", result);
        resolve(result);
      } catch (parseError) {
        console.error("❌ Failed to parse JSON from Python output");
        console.error("stdout was:", stdout);
        console.error("parseError:", parseError.message);
        reject("Failed to parse Python output");
      }
    });
  });
};


const processPDFSummary = (filePath) => {
  console.log("🧠 In Service: Starting PDF summarization with Gemini...");
  return new Promise((resolve, reject) => {
    execFile("python", ["../core/summarize.py", filePath, GEMINI_API_KEY], (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Python summarization error:");
        console.error("stderr:", stderr);
        return reject("Failed to summarize PDF");
      }

      try {
        const result = JSON.parse(stdout);
        console.log("✅ Parsed summary result:", result);
        resolve(result);
      } catch (parseError) {
        console.error("❌ Failed to parse summary JSON output");
        console.error("stdout was:", stdout);
        reject("Failed to parse Python output");
      }
    });
  });
};


module.exports = {
  processPDFSearch,
  processPDFSummary
};