const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const fs = require('fs'); // only needed if you want to read the file from disk

const app = express();

// Enable CORS so Next.js (port 3000) can call this server (port 8000)
app.use(cors());

// Use Multer to handle the file upload, storing in the 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

// Define the /extract_resume endpoint
app.post('/extract_resume', upload.single('file'), async (req, res) => {
  try {
    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({ detail: 'No file was uploaded.' });
    }

    // req.file contains info about the uploaded file, e.g., path in /uploads
    const filePath = req.file.path; // 'uploads/xxxxxx'

    // Read the file from disk
    const fileBuffer = fs.readFileSync(filePath);

    // Use pdfParse to extract text
    const data = await pdfParse(fileBuffer);

    // Return the text to the client
    return res.json({ content: data.text });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ detail: error.message || 'Failed to process PDF.' });
  }
});

// Start listening on port 8000
app.listen(8000, () => {
  console.log('Node.js server listening on http://127.0.0.1:8000');
});
