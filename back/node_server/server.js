const express = require('express');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

const app = express();

app.post('/receive_result', upload.single('file'), (req, res) => {
  console.log('Received file:', req.file);
  
  fs.readFile(req.file.path, 'utf8', (err, data) => {
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
