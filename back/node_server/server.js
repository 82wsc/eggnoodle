const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.post('/receive_result', upload.single('file'), (req, res) => {
  console.log('Received file:', req.file);

  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    const jsonData = JSON.parse(data);
    console.log(JSON.stringify(jsonData, null, 4));

    fs.writeFile('final_result.json', JSON.stringify(jsonData, null, 4), (err) => {
      if (err) return res.status(500).send('Error saving file');
      console.log("전송 성공");
      res.send('File received and processed');
    });
  });
});

app.get('/api/status', (req, res) => {
  fs.readFile(path.join(__dirname, 'final_result.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading final_result.json:', err);
      return res.status(500).send('Error reading data');
    }
    res.json(JSON.parse(data));
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
