const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "../../hymns.db"));

// 데이터베이스 초기화
db.serialize(() => {
  // 성가 테이블 생성
  db.run(`CREATE TABLE IF NOT EXISTS hymns (
    number INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL
  )`);

  // 히스토리 테이블 생성
  db.run(`CREATE TABLE IF NOT EXISTS history (
    date TEXT,
    hymn_number INTEGER,
    FOREIGN KEY(hymn_number) REFERENCES hymns(number)
  )`);
});

module.exports = db;
