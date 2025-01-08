let selectedHymns = [];

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

  selectedHymns.push({ number, type });
  updateSelectedHymnsList();

  // 입력 필드 초기화
  numberInput.value = "";
}

function updateSelectedHymnsList() {
  const list = document.getElementById("selectedHymnsList");
  list.innerHTML = "";

  selectedHymns.forEach((hymn, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            ${hymn.type}: ${hymn.number}번
            <button onclick="removeHymn(${index})">삭제</button>
        `;
    list.appendChild(li);
  });
}

function removeHymn(index) {
  selectedHymns.splice(index, 1);
  updateSelectedHymnsList();
}

function getRandomHymns() {
  showLoading();
  fetch("/api/random-hymns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selectedHymns }),
  })
    .then((response) => response.json())
    .then((data) => {
      displayResults(data);
      showAlert("성가가 선택되었습니다.");
    })
    .catch((error) => {
      console.error("Error:", error);
      showAlert("성가 선택 중 오류가 발생했습니다.", "error");
    });
}

function displayResults(data) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
        <h3>선택된 성가</h3>
        <div class="hymn-results">
            <div class="hymn-category">
                <h4>입당성가</h4>
                ${formatHymns(data.entrance)}
            </div>
            <div class="hymn-category">
                <h4>봉헌성가</h4>
                ${formatHymns(data.offering)}
            </div>
            <div class="hymn-category">
                <h4>성체성가</h4>
                ${formatHymns(data.communion)}
            </div>
            <div class="hymn-category">
                <h4>파견성가</h4>
                ${formatHymns(data.closing)}
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

// 터치 이벤트 최적화
document.addEventListener("touchstart", function () {}, { passive: true });

// 로딩 상태 표시
function showLoading() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = '<div class="loading"></div>';
}

// 알림 메시지 표시
function showAlert(message, type = "success") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  const container = document.querySelector(".container");
  container.insertBefore(alert, container.firstChild);

  setTimeout(() => alert.remove(), 3000);
}

// 입력 필드 포커스 시 자동 스크롤
const inputs = document.querySelectorAll("input, select");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    setTimeout(() => {
      this.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  });
});
