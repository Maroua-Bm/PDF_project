const { execFile } = require("child_process");
const path = require("path"); 
const GEMINI_API_KEY = "AIzaSyDECTvPfUQL208OfKS_Jsyfz0E2PLmuFAE";

const processPDFSearch = (filePath, query) => {
  console.log("In Service: Starting PDF processing with Python...");

  return new Promise((resolve, reject) => {
    console.log("Calling Python script with:");
    console.log("  FilePath:", filePath);
    console.log(" Query:", query);

    const scriptPath = path.join(__dirname, "../../core/main.py");

    const pythonProcess = execFile(
      "python",
      [scriptPath, filePath, query],
      { timeout: 900000 } 
    );

    let outputData = "";

    pythonProcess.stdout.on("data", (data) => {
      const text = data.toString();
      console.log("Python STDOUT:", text.trim());
      outputData += text;
    });

    pythonProcess.stderr.on("data", (data) => {
      console.log(" Python LOG:", data.toString().trim());
    });

    pythonProcess.on("close", (code, signal) => {
      console.log(`Python process exited. code=${code} signal=${signal}`);
      if (signal) {
        return reject(` Python process killed by signal: ${signal}`);
      }
      if (code !== 0) {
        return reject(`Python process exited with error code ${code}`);
      }
      try {
        const result = JSON.parse(outputData);
        console.log("✅ Parsed Python JSON result:", result);
        resolve(result);
      } catch (err) {
        console.error("Failed to parse JSON from Python output");
        console.error("Raw stdout was:", outputData);
        reject("Failed to parse Python output");
      }
    });

    pythonProcess.on("error", (err) => {
      console.error(" Failed to start Python process:", err.message);
      reject("Failed to start Python");
    });
  });
};


const processPDFSummary = (filePath) => {
  console.log("In Service: Starting PDF summarization with Gemini...");
  return new Promise((resolve, reject) => {
    execFile("python", ["../core/summarize.py", filePath, GEMINI_API_KEY], (err, stdout, stderr) => {
      if (err) {
        console.error("Python summarization error:");
        console.error("stderr:", stderr);
        return reject("Failed to summarize PDF");
      }
      try {
        const result = JSON.parse(stdout);
        console.log("Parsed summary result:", result);
        resolve(result);
      } catch (parseError) {
        console.error("Failed to parse summary JSON output");
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