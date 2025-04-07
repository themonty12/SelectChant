let hymns = [];
let selectedHymns = [];
let hymnHistory = [];

// 성가 데이터 로드
async function loadHymns() {
  try {
    const response = await fetch("data/hymns.json");
    const data = await response.json();
    hymns = data.hymns;
    console.log(`${hymns.length}개의 성가가 로드되었습니다.`);
  } catch (error) {
    console.error("성가 데이터 로드 실패:", error);
  }
}

// 메뉴 관련 기능
function initializeMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menuOverlay = document.querySelector('.menu-overlay');
  const sideMenu = document.querySelector('.side-menu');
  const menuItems = document.querySelectorAll('.menu-item');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    sideMenu.classList.toggle('active');
  });

  menuOverlay.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    menuOverlay.classList.remove('active');
    sideMenu.classList.remove('active');
  });

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = item.getAttribute('data-section');
      
      // 메뉴 아이템 활성화 상태 변경
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // 섹션 전환
      document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(`${targetSection}-section`).classList.add('active');
      
      // 메뉴 닫기
      menuToggle.classList.remove('active');
      menuOverlay.classList.remove('active');
      sideMenu.classList.remove('active');
    });
  });
}

// 성가 검색 기능
let currentPage = 1;
const itemsPerPage = 10;
let filteredHymns = [];
let currentHymnImages = [];
let currentImageIndex = 0;

function searchHymns() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase();
  const searchResults = document.getElementById('searchResults');
  const hymnList = document.querySelector('.hymn-list');
  
  if (!searchTerm) {
    // 검색어가 없으면 모든 성가 표시
    filteredHymns = [...hymns];
  } else {
    // 제목으로 검색
    filteredHymns = hymns.filter(hymn => 
      hymn.title.toLowerCase().includes(searchTerm)
    );
  }
  
  // 페이지 초기화
  currentPage = 1;
  
  // 결과 표시
  displaySearchResults();
}

function displaySearchResults() {
  const hymnList = document.querySelector('.hymn-list');
  const pagination = document.querySelector('.pagination');
  
  if (filteredHymns.length === 0) {
    hymnList.innerHTML = '<p class="no-results">검색 결과가 없습니다.</p>';
    pagination.style.display = 'none';
    return;
  }
  
  // 페이지네이션 표시
  pagination.style.display = 'flex';
  
  // 현재 페이지의 성가만 표시
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredHymns.length);
  const currentHymns = filteredHymns.slice(startIndex, endIndex);
  
  // 성가 목록 생성
  hymnList.innerHTML = currentHymns.map(hymn => createHymnListItem(hymn)).join('');
  
  // 성가 제목 클릭 이벤트 추가
  document.querySelectorAll('.hymn-title').forEach(title => {
    title.addEventListener('click', (e) => {
      const hymnNumber = parseInt(e.target.closest('.hymn-item').getAttribute('data-number'));
      showHymnImages(hymnNumber);
    });
  });
  
  // 페이지네이션 업데이트
  updatePagination();
}

function createHymnListItem(hymn) {
  return `
    <div class="hymn-item" data-number="${hymn.number}">
      <div class="hymn-number">${hymn.number}번</div>
      <div class="hymn-title">${hymn.title}</div>
    </div>
  `;
}

function showHymnImages(hymnNumber) {
  // 성가 번호에 해당하는 폴더 계산
  const folderNumber = Math.floor(hymnNumber / 10);
  
  // 이미지 경로 생성
  const imagePath1 = `data/images/${folderNumber}/${hymnNumber}.jpg`;
  const imagePath2 = `data/images/${folderNumber}/${hymnNumber}-1.jpg`;
  
  // 이미지 배열 초기화
  currentHymnImages = [];
  currentImageIndex = 0;
  
  // 이미지 존재 여부 확인
  const checkImage = (path) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(path);
      img.onerror = () => resolve(null);
      img.src = path;
    });
  };
  
  // 이미지 확인 및 모달 표시
  Promise.all([checkImage(imagePath1), checkImage(imagePath2)])
    .then(([path1, path2]) => {
      if (path1) currentHymnImages.push(path1);
      if (path2) currentHymnImages.push(path2);
      
      if (currentHymnImages.length > 0) {
        // 모달 표시
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        
        modalImage.src = currentHymnImages[0];
        modal.style.display = 'block';
        
        // 이전/다음 버튼 상태 업데이트
        updateModalButtons();
      } else {
        alert('이미지가 없습니다.');
      }
    });
}

function updateModalButtons() {
  const prevBtn = document.getElementById('prevImage');
  const nextBtn = document.getElementById('nextImage');
  
  prevBtn.disabled = currentImageIndex === 0;
  nextBtn.disabled = currentImageIndex === currentHymnImages.length - 1;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
}

function showPrevImage() {
  if (currentImageIndex > 0) {
    currentImageIndex--;
    document.getElementById('modalImage').src = currentHymnImages[currentImageIndex];
    updateModalButtons();
  }
}

function showNextImage() {
  if (currentImageIndex < currentHymnImages.length - 1) {
    currentImageIndex++;
    document.getElementById('modalImage').src = currentHymnImages[currentImageIndex];
    updateModalButtons();
  }
}

function updatePagination() {
  const totalPages = Math.ceil(filteredHymns.length / itemsPerPage);
  const pageNumbers = document.getElementById('pageNumbers');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  
  // 이전/다음 버튼 상태 업데이트
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
  
  // 페이지 번호 생성
  let pageHtml = '';
  
  // 최대 5개의 페이지 번호만 표시
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  // 첫 페이지
  if (startPage > 1) {
    pageHtml += `<div class="page-number" data-page="1">1</div>`;
    if (startPage > 2) {
      pageHtml += `<div class="page-ellipsis">...</div>`;
    }
  }
  
  // 페이지 번호
  for (let i = startPage; i <= endPage; i++) {
    pageHtml += `<div class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</div>`;
  }
  
  // 마지막 페이지
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageHtml += `<div class="page-ellipsis">...</div>`;
    }
    pageHtml += `<div class="page-number" data-page="${totalPages}">${totalPages}</div>`;
  }
  
  pageNumbers.innerHTML = pageHtml;
  
  // 페이지 번호 클릭 이벤트 추가
  document.querySelectorAll('.page-number').forEach(pageNum => {
    pageNum.addEventListener('click', () => {
      const page = parseInt(pageNum.getAttribute('data-page'));
      if (page !== currentPage) {
        currentPage = page;
        displaySearchResults();
      }
    });
  });
  
  // 이전/다음 버튼 이벤트 추가
  prevPageBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displaySearchResults();
    }
  };
  
  nextPageBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displaySearchResults();
    }
  };
}

// 히스토리 관리
function addToHistory(result) {
  const historyItem = {
    date: new Date().toLocaleDateString(),
    hymns: result
  };
  
  hymnHistory.unshift(historyItem);
  if (hymnHistory.length > 10) {
    hymnHistory.pop();
  }
  
  updateHistoryList();
  saveHistory();
}

function updateHistoryList() {
  const historyList = document.getElementById('historyList');
  
  if (hymnHistory.length === 0) {
    historyList.innerHTML = '<p>아직 선택된 성가가 없습니다.</p>';
    return;
  }
  
  historyList.innerHTML = hymnHistory
    .map((item, index) => `
      <div class="history-item">
        <div class="history-date">${item.date}</div>
        <div class="history-hymns">
          <div>입당: ${formatHymnList(item.hymns.entrance)}</div>
          <div>봉헌: ${formatHymnList(item.hymns.offering)}</div>
          <div>성체: ${formatHymnList(item.hymns.communion)}</div>
          <div>파견: ${formatHymnList(item.hymns.closing)}</div>
        </div>
      </div>
    `)
    .join('');
}

function formatHymnList(hymns) {
  return hymns.map(h => `${h.number}번`).join(', ');
}

function saveHistory() {
  localStorage.setItem('hymnHistory', JSON.stringify(hymnHistory));
}

function loadHistory() {
  const saved = localStorage.getItem('hymnHistory');
  if (saved) {
    hymnHistory = JSON.parse(saved);
    updateHistoryList();
  }
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
  loadHymns();
  initializeMenu();
  loadHistory();
  
  // 검색 섹션이 활성화될 때 모든 성가 표시
  document.querySelector('[data-section="search"]').addEventListener('click', () => {
    setTimeout(() => {
      if (filteredHymns.length === 0) {
        filteredHymns = [...hymns];
        displaySearchResults();
      }
    }, 300); // 메뉴 애니메이션 완료 후 실행
  });
  
  // 검색 입력 필드에서 엔터 키 이벤트 처리
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchHymns();
    }
  });
  
  // 모달 닫기 버튼 이벤트
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  
  // 모달 외부 클릭 시 닫기
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('imageModal');
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // 이전/다음 이미지 버튼 이벤트
  document.getElementById('prevImage').addEventListener('click', showPrevImage);
  document.getElementById('nextImage').addEventListener('click', showNextImage);
});

function addHymn() {
  const numberInput = document.getElementById("hymnNumber");
  const typeSelect = document.getElementById("hymnType");
  const number = parseInt(numberInput.value);
  const type = typeSelect.value;

  if (!number || number < 1 || number > 400) {
    alert("유효한 성가 번호를 입력하세요 (1-400)");
    return;
  }

  // 이미 선택된 성가인지 확인
  const existingHymn = selectedHymns.find(h => h.number === number);
  if (existingHymn) {
    alert("이미 선택된 성가입니다.");
    return;
  }

  // 해당 타입의 성가 개수 확인
  const typeCount = selectedHymns.filter(h => h.type === type).length;
  const maxCount = type === "입당" || type === "파견" ? 1 : 2;
  
  if (typeCount >= maxCount) {
    alert(`${type} 성가는 최대 ${maxCount}개까지만 지정할 수 있습니다.`);
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
            ${hymn.type}: <span class="hymn-title" data-number="${hymn.number}">${hymn.number}번 - ${hymn.title}</span>
            <button onclick="removeSelectedHymn(${index})">삭제</button>
        `;
    list.appendChild(li);
  });
  
  // 성가 제목 클릭 이벤트 추가
  document.querySelectorAll('#selectedHymnsList .hymn-title').forEach(title => {
    title.addEventListener('click', (e) => {
      const hymnNumber = parseInt(e.target.getAttribute('data-number'));
      showHymnImages(hymnNumber);
    });
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
        <button class="confirm-button" onclick="confirmSelection()">지정</button>
    `;
    
  // 성가 제목 클릭 이벤트 추가
  document.querySelectorAll('.result-grid .hymn-title').forEach(title => {
    title.addEventListener('click', (e) => {
      const hymnNumber = parseInt(e.target.getAttribute('data-number'));
      showHymnImages(hymnNumber);
    });
  });
}

function formatHymns(hymns) {
  return hymns
    .map(
      (hymn) => `<div class="hymn-item"><span class="hymn-title" data-number="${hymn.number}">${hymn.number}번 - ${hymn.title}</span></div>`
    )
    .join("");
}

function confirmSelection() {
  const resultDiv = document.getElementById("result");
  const result = {
    entrance: getRandomByType("입당", 1, selectedHymns.map(h => h.number)),
    offering: getRandomByType("봉헌", 2, selectedHymns.map(h => h.number)),
    communion: getRandomByType("성체", 2, selectedHymns.map(h => h.number)),
    closing: getRandomByType("파견", 1, selectedHymns.map(h => h.number))
  };
  
  // 결과를 히스토리에 추가
  addToHistory(result);
  
  // 지정 완료 메시지 표시
  resultDiv.innerHTML = `
    <div class="confirmation-message">
      <h3>성가가 지정되었습니다!</h3>
      <p>지난 성가 목록에서 확인할 수 있습니다.</p>
      <button class="random-button" onclick="getRandomHymns()">다시 선택</button>
    </div>
  `;
}
