const express = require('express');
const multer = require('multer');
const path = require('path');
const { handleUpload, handleAnalyze } = require('../controllers/analyzeController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are supported.'));
    }
  },
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post('/upload', upload.single('resume'), handleUpload);
router.post('/analyze', handleAnalyze);

module.exports = router;
