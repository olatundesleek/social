const multer = require("multer");
const path = require('path');

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // File will be saved in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// Multer file filter for validation (e.g., only image/video)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mkv'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false); // Error message
  }
};

// Create the Multer upload instance
const upload = multer({
  storage,
  fileFilter, // Attach file filter for validation
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit to 10MB per file
});

// Export upload middleware and service function
module.exports = {
  uploadMedia: upload.array('media', 4), // Allow up to 4 media files
};
