let hymns = [];
let selectedHymns = [];

// 성가 데이터 로드
async function loadHymns() {
  try {
    const response = await fetch("data/hymns.json");
    const data = await response.json();
    hymns = data.hymns;
  } catch (error) {
    console.error("성가 데이터 로드 실패:", error);
  }
}

// 페이지 로드 시 성가 데이터 로드
document.addEventListener("DOMContentLoaded", loadHymns);

function addHymn() {
  const numberInput = document.getElementById("hymnNumber");
  const typeSelect = document.getElementById("hymnType");
  const number = parseInt(numberInput.value);
  const type = typeSelect.value;

  if (!number || number < 1 || number > 400) {
    alert("유효한 성가 번호를 입력하세요 (1-400)");
    return;
  }

  if (selectedHymns.length >= 6) {
    alert("최대 6개까지만 지정할 수 있습니다.");
    return;
  }

  const hymn = hymns.find((h) => h.number === number);
  if (!hymn) {
    alert("존재하지 않는 성가 번호입니다.");
    return;
  }

  selectedHymns.push({ ...hymn, type });
  updateSelectedHymnsList();
  numberInput.value = "";
}

function getRandomHymns() {
  const excludeNumbers = selectedHymns.map((h) => h.number);

  const result = {
    entrance: getRandomByType("입당", 1, excludeNumbers),
    offering: getRandomByType("봉헌", 2, excludeNumbers),
    communion: getRandomByType("성체", 2, excludeNumbers),
    closing: getRandomByType("파견", 1, excludeNumbers),
  };

  displayResults(result);
}

function getRandomByType(type, count, excludeNumbers) {
  const availableHymns = hymns.filter(
    (h) => h.type === type && !excludeNumbers.includes(h.number)
  );

  const result = [];
  for (let i = 0; i < count && availableHymns.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableHymns.length);
    result.push(availableHymns.splice(randomIndex, 1)[0]);
  }
  return result;
}

// ... (나머지 함수들은 이전과 동일)
