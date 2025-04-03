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
  console.log(`선택된 성가 : ${excludeNumbers}`);

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
    (h) => !excludeNumbers.includes(h.number)
  );

  const result = [];
  const matchingHymns = hymns.filter(
    (h) => excludeNumbers.includes(h.number)
  );
  result.push(...matchingHymns);

  if (result.length < count) {
    const remaining = count - result.length;
    for (let i = 0; i < remaining && availableHymns.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableHymns.length);
      result.push(availableHymns.splice(randomIndex, 1)[0]);
    }
  }
  return result;
}

function updateSelectedHymnsList() {
  const list = document.getElementById("selectedHymnsList");
  list.innerHTML = "";

  selectedHymns.forEach((hymn, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            ${hymn.type}: ${hymn.number}번 - ${hymn.title}
            <button onclick="removeSelectedHymn(${index})">삭제</button>
        `;
    list.appendChild(li);
  });
}

function removeSelectedHymn(index) {
  selectedHymns.splice(index, 1);
  updateSelectedHymnsList();
}

function displayResults(result) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
        <div class="result-grid">
            <div class="hymn-category">
                <h4>입당성가</h4>
                ${formatHymns(result.entrance)}
            </div>
            <div class="hymn-category">
                <h4>봉헌성가</h4>
                ${formatHymns(result.offering)}
            </div>
            <div class="hymn-category">
                <h4>성체성가</h4>
                ${formatHymns(result.communion)}
            </div>
            <div class="hymn-category">
                <h4>파견성가</h4>
                ${formatHymns(result.closing)}
            </div>
        </div>
    `;
}

function formatHymns(hymns) {
  return hymns
    .map(
      (hymn) => `<div class="hymn-item">${hymn.number}번 - ${hymn.title}</div>`
    )
    .join("");
}
