const { execFile } = require("child_process");

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

module.exports = {
  processPDFSearch
};

