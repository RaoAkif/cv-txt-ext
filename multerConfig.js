// multerConfig.js
const multer = require('multer');

// Set up Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
