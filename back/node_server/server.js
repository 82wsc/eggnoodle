const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// 현재 일시분초를 기반으로 파일 이름 생성
const generateFileName = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `result_${year}${month}${day}_${hours}${minutes}${seconds}.json`;
};

// 저장소 설정: 파일 이름을 지정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const newFileName = generateFileName(); // 저장할 파일 이름 지정
    cb(null, newFileName);
  }
});

// Multer 설정 (파일 업로드를 위한 미들웨어)
const upload = multer({ storage: storage });

app.post('/receive_result', upload.single('file'), (req, res) => {
  console.log('Received file:', req.file);

  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    const jsonData = JSON.parse(data);
    console.log(JSON.stringify(jsonData, null, 4)); // JSON 데이터 사용 가능

    // 파일 수신 및 처리가 성공적으로 완료되었을 때 로그 출력
    console.log("전송 성공");

    res.send('File received and processed');
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
