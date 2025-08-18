const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

// Create folders if not exist
const uploadDir = path.join(__dirname, 'uploads');
const convertedDir = path.join(__dirname, 'converted');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Serve frontend
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')));
app.get('/script.js', (req, res) => res.sendFile(path.join(__dirname, 'script.js')));

// API: Convert Word to PDF
app.post('/convert', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).send('No files uploaded');

  const convertedFiles = [];

  req.files.forEach(file => {
    const inputPath = path.join(uploadDir, file.filename);

    exec(`soffice --headless --convert-to pdf "${inputPath}" --outdir "${convertedDir}"`, (err) => {
      if (err) console.error(err);

      convertedFiles.push(file.filename.replace(/\.[^/.]+$/, ".pdf"));

      if (convertedFiles.length === req.files.length) res.json({ files: convertedFiles });
    });
  });
});

// Serve converted PDFs
app.use('/converted', express.static(convertedDir));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
