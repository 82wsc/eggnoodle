const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 'uploads' 폴더가 없으면 생성합니다.
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
  origin: 'http://localhost:8080', // Vue가 실행 중인 주소
  methods: ['GET', 'POST'],  // 허용할 HTTP 메소드
  credentials: true  // 쿠키를 포함할 경우 true
}));

let appData = {
  currentTime: new Date().toTimeString().slice(0, 8),
  tables: [
    { id: 1, uses: 0 },
    { id: 2, uses: 0 },
    { id: 3, uses: 0 },
    { id: 4, uses: 0 },
    { id: 5, uses: 0 },
    { id: 6, uses: 0 }
  ],
  besttable: 1,
  leasttable: 5,
  meantime: 0,
  open: 0,
  middle: 0,
  last: 0,
  availableTables: 0,
  twoPersonTables: 0,
  fourPersonTables: 0,
  sixPersonTables: 0,
  availableSeats: 0,
  tableNumber: 0,
  tableTime: 0
};

app.post('/receive_result', upload.single('file'), (req, res) => {
  console.log('Received file:', req.file);

  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    const jsonData = JSON.parse(data);
    console.log(JSON.stringify(jsonData, null, 4)); // JSON 데이터 사용 가능

    // 필요한 데이터 처리 로직을 여기에 추가
    // 예를 들어, receivedData를 appData에 반영하는 로직:
    appData.availableTables = jsonData.useable_TotalTable;
    appData.availableSeats = jsonData.useable_TotalChair;
    appData.twoPersonTables = jsonData.Double_Seat;
    appData.fourPersonTables = jsonData.Four_Seat;
    appData.sixPersonTables = jsonData.Six_Seat;

    // 파일 수신 및 처리가 성공적으로 완료되었을 때 로그 출력
    console.log("전송 성공");

    res.send('File received and processed');
  });
});

app.get('/api/status', (req, res) => {
  appData.currentTime = new Date().toTimeString().slice(0, 8); // 요청시마다 시간 업데이트
  res.json(appData);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
