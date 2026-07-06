const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const resumeRoutes = require('./routes/resume');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', resumeRoutes);

app.get('/api/health', (req, res) => {
  res.send({ message: 'AI Resume Analyzer backend is running.' });
});

const publicPath = path.join(__dirname, 'public');
const indexPath = path.join(publicPath, 'index.html');

if (fs.existsSync(indexPath)) {
  app.use(express.static(publicPath));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found.' });
    }
    return res.sendFile(indexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.send({ message: 'AI Resume Analyzer backend is running.' });
  });
}

app.listen(port, () => {
  console.log(`Resume Analyzer backend listening on port ${port}`);
});
