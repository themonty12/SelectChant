const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());  

// 데이터베이스 연결
const {client, getHymns} = require('./api/db');



// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 접근 URL: http://localhost:${PORT}/api/hymns`);
});
