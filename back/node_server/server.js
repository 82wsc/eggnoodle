const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');  // axios로 요청을 보내기 위해 추가

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

let finalResult = {};

app.post('/receive_result', upload.single('file'), (req, res) => {
  console.log('Received file:', req.file);

  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    const jsonData = JSON.parse(data);
    console.log(JSON.stringify(jsonData, null, 4));

    // 현재 시간을 원하는 형식으로 얻어 run_time에 저장
    const currentTime = new Date();
    const formattedTime = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')} ${currentTime.getHours().toString().padStart(2, '0')}시${currentTime.getMinutes().toString().padStart(2, '0')}분`;

    // 파일 이름에 따라 finalResult 객체 업데이트
    if (req.file.originalname === 'FixResult.json') {
      finalResult.fix = jsonData;
    } else if (req.file.originalname === 'FlexibleResult.json') {
      finalResult.flexible = jsonData;
    }

    // run_time 추가
    finalResult.run_time = formattedTime;

    fs.writeFile('final_result.json', JSON.stringify(finalResult, null, 4), (err) => {
      if (err) return res.status(500).send('Error saving file');
      console.log("전송 성공");
      res.send('File received and processed');
    });
  });
});

app.post('/reset_result', async (req, res) => {
  // 현재 시간을 원하는 형식으로 얻어 run_time에 저장
  const currentTime = new Date();
  const formattedTime = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')} ${currentTime.getHours().toString().padStart(2, '0')}시${currentTime.getMinutes().toString().padStart(2, '0')}분`;

  finalResult = {
    fix: {
      Two_Seat_Utilization_Rate: 0,
      Four_Seat_Utilization_Rate: 0,
      utilization_rates: {
        "1_Utilization_Rate": 0,
        "2_Utilization_Rate": 0,
        "3_Utilization_Rate": 0,
        "4_Utilization_Rate": 0,
        "5_Utilization_Rate": 0,
        "6_Utilization_Rate": 0
      }
    },
    flexible: {
      useable_TotalTable: 0,
      useable_TotalChair: 0,
      Double_Seat: 0,
      Four_Seat: 0,
      Six_Seat: 0
    },
    run_time: formattedTime
  };

  fs.writeFile('final_result.json', JSON.stringify(finalResult, null, 4), async (err) => {
    if (err) return res.status(500).send('Error saving file');
    console.log("초기화 성공");

    // Flask 서버 파일 초기화 요청
    try {
      const response = await axios.post('http://localhost:5000/reset_result');
      console.log('Flask server files reset successfully');
      res.send('Result reset');
    } catch (error) {
      console.error('Error resetting Flask server files:', error);
      res.status(500).send('Error resetting Flask server files');
    }
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
