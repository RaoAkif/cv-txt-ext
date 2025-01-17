const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Enable CORS
app.use(cors());

// Multer setup to store files in 'uploads/' folder
const upload = multer({ dest: "uploads/" });

// Define the /extract_resume endpoint
app.post("/extract_resume", upload.single("file"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ detail: "No file was uploaded." });
    }

    const filePath = req.file.path; // Temporary file path
    console.log("File uploaded:", filePath);

    // Read the uploaded file
    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(filePath);
      console.log("File read successfully.");
    } catch (error) {
      console.error("Error reading file:", error.message);
      return res.status(500).json({ detail: "Failed to read uploaded file." });
    }

    // Parse the PDF content
    try {
      const data = await pdfParse(fileBuffer);
      console.log("PDF parsed successfully.");
      return res.json({ content: data.text }); // Return parsed content
    } catch (error) {
      console.error("Error parsing PDF:", error.message);
      return res.status(500).json({ detail: "Failed to parse PDF content." });
    }
  } catch (error) {
    console.error("Unexpected server error:", error.message);
    return res.status(500).json({ detail: "An unexpected error occurred on the server." });
  }
});

// Start listening on port 8000
app.listen(8000, () => {
  console.log("Server is running on http://127.0.0.1:8000");
});
