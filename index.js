// index.js
const express = require('express');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const upload = require('./multerConfig');

const app = express();

// Enable CORS
app.use(cors());

// Define the /extract_resume endpoint
app.post('/api/extract_resume', upload.single('file'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ detail: 'No file was uploaded.' });
    }

    // Parse the PDF content from the buffer
    try {
      const data = await pdfParse(req.file.buffer);
      return res.json({ content: data.text }); // Return parsed content
    } catch (error) {
      console.error('Error parsing PDF:', error.message);
      return res.status(500).json({ detail: 'Failed to parse PDF content.' });
    }
  } catch (error) {
    console.error('Unexpected server error:', error.message);
    return res.status(500).json({ detail: 'An unexpected error occurred on the server.' });
  }
});

// Export the app for Vercel
module.exports = app;
