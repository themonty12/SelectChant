const db = require("./db");

// 성가 유형 목록
const hymnTypes = [
  "입당",
  "봉헌",
  "성체",
  "파견",
  "대림",
  "성탄",
  "부활",
  "기타",
];

const hymns = [
  { number: 9, title: "가자 갈릴래아로" },
  { number: 10, title: "감사해" },
  { number: 11, title: "거룩하다 부활이여" },
  { number: 12, title: "꽃" },
  { number: 13, title: "고인의 기도" },
  { number: 15, title: "꽃들에게 희망을" },
  { number: 17, title: "구원자 예수" },
  { number: 18, title: "그길" },
  { number: 19, title: "그리스도와 함께" },
  { number: 20, title: "그분께로 한걸음씩" },
  { number: 21, title: "그 사랑의 숨결" },
  { number: 22, title: "기대" },
  { number: 23, title: "그 소리 들었네" },
  { number: 26, title: "나" },
  { number: 27, title: "나는 빈 털털이 였다네" },
  { number: 28, title: "나는 알아요" },
  { number: 29, title: "나는 찬양하리라" },
  { number: 29, title: "내 손을 주께" },
  { number: 30, title: "나를 따르라" },
  { number: 31, title: "나를 받으옵소서" },
  { number: 32, title: "나보다 더" },
  { number: 33, title: "나의 하느님" },
  { number: 35, title: "날마다 숨쉬는 순간마다" },
  { number: 36, title: "낮은자 되게 하신주" },
  { number: 37, title: "내가 만난 그분" },
  { number: 38, title: "내 발을 씻으신 예수" },
  { number: 39, title: "내가 천사의 말 한다 해도" },
  { number: 41, title: "내생애의 모든것" },
  { number: 42, title: "너 나를 사랑하느냐" },
  { number: 43, title: "누군가 널 위해 기도하네" },
  { number: 44, title: "눈물이 흘러도" },
  { number: 46, title: "다리" },
  { number: 47, title: "당신은 사랑받기위해 태어난 사람" },
  { number: 48, title: "당신을 향한 노래" },
  { number: 49, title: "또하나의 열매를 바라시며" },
  { number: 50, title: "로사의 편지" },
  { number: 51, title: "딜레마" },
  { number: 54, title: "마음을 열어요" },
  { number: 55, title: "마리아의 노래" },
  { number: 57, title: "마음을 드높이" },
  { number: 59, title: "뭉게구름" },
  { number: 59, title: "목마른 사슴" },
  { number: 60, title: "무엇을 먹을까" },
  { number: 61, title: "물이 바다 덮음 같이" },
  { number: 62, title: "봉헌" },
  { number: 63, title: "부활을 만나리라" },
  { number: 64, title: "비전" },
  { number: 66, title: "사랑은" },
  { number: 67, title: "사랑의 송가" },
  { number: 68, title: "사랑찾아 나는새" },
  { number: 69, title: "사랑한다는 말은" },
  { number: 71, title: "새로운 계명" },
  { number: 72, title: "사랑하올 어머니" },
  { number: 72, title: "생명의 성체여" },
  { number: 73, title: "생명의 양식" },
  { number: 73, title: "수난 기약 다 다르니" },
  { number: 74, title: "성모님께 드리는 노래" },
  { number: 75, title: "서로의 빛이 되어" },
  { number: 77, title: "소나무" },
  { number: 78, title: "소망" },
  { number: 79, title: "신아가" },
  { number: 80, title: "실로암" },
  { number: 81, title: "십자가" },
  { number: 82, title: "십자가의 길(순교자의 삶)" },
  { number: 83, title: "십자가를 그으리라" },
  { number: 85, title: "십자가 지고 가시는" },
  { number: 87, title: "아버지" },
  { number: 89, title: "아버지 뜻대로" },
  { number: 90, title: "어머니" },
  { number: 91, title: "어서가 경배하세" },
  { number: 91, title: "영원한 사랑" },
  { number: 92, title: "언제나 주님께 감사해" },
  { number: 93, title: "예수님을 따르는 사람들2" },
  { number: 94, title: "예수 부활하셨네" },
  { number: 94, title: "예수 부활하셨도다" },
  { number: 95, title: "영원도 하시어라 그 사랑이여" },
  { number: 97, title: "오나의 자비로운 주요" },
  { number: 98, title: "우리" },
  { number: 99, title: "우리 다시 여기에" },
  { number: 100, title: "우리 어두운 눈이 그를" },
  { number: 101, title: "이는 내 사랑하는 아들이니" },
  { number: 103, title: "이 시간 너의 맘속에" },
  { number: 104, title: "이와 같은 때엔" },
  { number: 105, title: "20대도 산타할아버지를 기다려" },
  { number: 107, title: "임 쓰신 가시관" },
  { number: 109, title: "작은 아기 예수님" },
  { number: 110, title: "정의와 평화 흐르는 곳에" },
  { number: 111, title: "제비꽃이 핀 언덕에" },
  { number: 112, title: "주 네맘에 들어가시려 하네" },
  { number: 113, title: "주님과 같이" },
  { number: 114, title: "주께 나아가리다" },
  { number: 114, title: "주님을 찬양해" },
  { number: 115, title: "주님 계신 곳 어디나" },
  { number: 117, title: "주님께 모두 드려요" },
  { number: 118, title: "주님은 나의 목자" },
  { number: 119, title: "주님의 숲" },
  { number: 120, title: "주님 사랑 안에서" },
  { number: 120, title: "주예수와 바꿀수 없네" },
  { number: 121, title: "주여 당신 종이 여기" },
  { number: 122, title: "주를 찬양하며" },
  { number: 122, title: "주 찬양합니다" },
  { number: 123, title: "주께 드리네" },
  { number: 123, title: "천사의 양식" },
  { number: 124, title: "축복송" },
  { number: 125, title: "축제" },
  { number: 127, title: "크리스마스 전야 미사후" },
  { number: 128, title: "평화의 노래" },
  { number: 129, title: "풀잎이 햇살에 춤추네" },
  { number: 130, title: "하나되게 하소서" },
  { number: 131, title: "하느님 그리고 나" },
  { number: 132, title: "하는님 내주시여" },
  { number: 133, title: "하느님 당신은 나의 모든것" },
  { number: 134, title: "하늘 아이" },
  { number: 135, title: "하연이에게" },
  { number: 136, title: "행복" },
  { number: 137, title: "Happy Happy Brithday" },
  { number: 138, title: "기타 추가곡" },
];

// 랜덤 타입 할당 함수
function getRandomType() {
  return hymnTypes[Math.floor(Math.random() * hymnTypes.length)];
}

// 중복된 번호 처리를 위해 id 필드 추가
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS hymns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number INTEGER,
        title TEXT NOT NULL,
        type TEXT NOT NULL
    )
`;

// DB에 성가 데이터 삽입
async function seedHymns() {
  try {
    // 테이블 재생성
    await new Promise((resolve, reject) => {
      db.run("DROP TABLE IF EXISTS hymns", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise((resolve, reject) => {
      db.run(createTableQuery, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // 새 데이터 삽입
    const insertPromises = hymns.map((hymn) => {
      return new Promise((resolve, reject) => {
        const type = getRandomType();
        db.run(
          "INSERT INTO hymns (number, title, type) VALUES (?, ?, ?)",
          [hymn.number, hymn.title, type],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    await Promise.all(insertPromises);
    console.log("성가 데이터 삽입 완료!");

    // 삽입된 데이터 확인 및 출력
    db.all("SELECT COUNT(*) as count FROM hymns", [], (err, rows) => {
      if (err) console.error("데이터 확인 중 오류:", err);
      else console.log(`총 ${rows[0].count}개의 성가가 등록되었습니다.`);
    });

    // 중복된 번호 확인
    db.all(
      `
        SELECT number, COUNT(*) as count, GROUP_CONCAT(title) as titles
        FROM hymns 
        GROUP BY number 
        HAVING COUNT(*) > 1
    `,
      [],
      (err, rows) => {
        if (err) console.error("중복 확인 중 오류:", err);
        else if (rows.length > 0) {
          console.log("\n중복된 번호가 있는 성가들:");
          rows.forEach((row) => {
            console.log(`${row.number}번: ${row.titles} (${row.count}개)`);
          });
        }
      }
    );
  } catch (error) {
    console.error("데이터 삽입 중 오류 발생:", error);
  }
}

// 스크립트 실행
seedHymns();
