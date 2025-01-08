const db = require("../database/db");

class Hymn {
  constructor(number, title, type) {
    this.number = number;
    this.title = title;
    this.type = type;
  }

  // 성가 저장
  static create(hymn) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO hymns (number, title, type) VALUES (?, ?, ?)",
        [hymn.number, hymn.title, hymn.type],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  // 특정 유형의 랜덤 성가 조회
  static getRandomByType(type, count, excludeNumbers = [], fromDate = null) {
    return new Promise((resolve, reject) => {
      let query = `
                SELECT number, title, type 
                FROM hymns 
                WHERE type = ?
            `;
      const params = [type];

      // 제외할 번호가 있는 경우
      if (excludeNumbers.length > 0) {
        query += ` AND number NOT IN (${excludeNumbers.join(",")})`;
      }

      // 최근 사용 이력 제외
      if (fromDate) {
        query += ` AND number NOT IN (
                    SELECT hymn_number 
                    FROM history 
                    WHERE date > ?
                )`;
        params.push(fromDate);
      }

      query += " ORDER BY RANDOM() LIMIT ?";
      params.push(count);

      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // 성가 사용 이력 기록
  static recordUsage(hymnNumber) {
    return new Promise((resolve, reject) => {
      const date = new Date().toISOString();
      db.run(
        "INSERT INTO history (date, hymn_number) VALUES (?, ?)",
        [date, hymnNumber],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  // 특정 성가 조회
  static findByNumber(number) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM hymns WHERE number = ?", [number], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // 모든 성가 조회
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM hymns ORDER BY number", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // 특정 유형의 성가 조회
  static findByType(type) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM hymns WHERE type = ? ORDER BY number",
        [type],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // 최근 사용 이력 조회
  static getRecentUsage(limit = 4) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT h.*, history.date 
                 FROM hymns h 
                 JOIN history ON h.number = history.hymn_number 
                 ORDER BY history.date DESC 
                 LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = Hymn;
