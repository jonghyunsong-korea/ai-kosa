// --- 글로벌 변수 및 설정 ---
const apiKey = ""; // API Key는 런타임 환경에서 제공됨. 빈 값 유지.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'refrigerator-emptying-app';

// 사용자 보유 인벤토리 식재료 목록 (기본 초기치)
let myIngredients = [
  { name: "달걀", quantity: "4개", expiry: "7일 남음" },
  { name: "대파", quantity: "1대", expiry: "3일 남음" },
  { name: "양파", quantity: "2개", expiry: "10일 남음" }
];

// 기본 양념/조미료 목록 (가중치 계산 시 제외 가능)
const basicSeasonings = ["소금", "설탕", "간장", "다진 마늘", "고추장", "된장", "참기름", "고춧가루", "식용유", "식초", "물"];

// 마스터 레시피 데이터베이스 (로컬 검증용 P0 데이터셋)
const localRecipeDatabase = [
  {
    id: 1,
    title: "마약 계란말이",
    category: "메인 요리 / 반찬",
    cookingTime: 10,
    difficulty: "쉬움",
    calories: 180,
    isLowSugar: true,
    imageUrl: "https://images.unsplash.com/photo-1510693042738-73236e7880ce?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: [
      { name: "달걀", amount: "4개", isEssential: true },
      { name: "대파", amount: "0.5대", isEssential: true },
      { name: "당근", amount: "1/4개", isEssential: false }
    ],
    seasonings: "소금, 참기름, 식용유",
    instructions: [
      "대파와 당근을 잘게 다져 보울에 넣습니다.",
      "보울에 달걀을 풀고 소금 한 꼬집을 넣은 뒤 다진 야채와 섞습니다.",
      "팬에 식용유를 두르고 가열한 후 달걀물을 1/3씩 붓습니다.",
      "달걀물이 살짝 익기 시작하면 끝에서부터 돌돌 말아가며 겹겹이 층을 냅니다.",
      "완성된 계란말이를 한김 식힌 후 일정한 크기로 썰어 냅니다."
    ],
    description: "부드럽고 쫄깃한 식감으로 남녀노소 사랑받는 대표 반찬"
  },
  {
    id: 2,
    title: "얼큰 두부 김치찌개",
    category: "찌개 / 국",
    cookingTime: 20,
    difficulty: "보통",
    calories: 340,
    isLowSugar: true,
    imageUrl: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: [
      { name: "김치", amount: "200g", isEssential: true },
      { name: "돼지고기", amount: "150g", isEssential: true },
      { name: "두부", amount: "0.5모", isEssential: true },
      { name: "대파", amount: "1대", isEssential: false },
      { name: "양파", amount: "0.5개", isEssential: false }
    ],
    seasonings: "고춧가루, 다진 마늘, 국간장, 물",
    instructions: [
      "김치와 돼지고기, 두부는 먹기 좋은 크기로 썰고 대파와 양파도 어슷 썰어둡니다.",
      "냄비에 참기름을 살짝 두르고 돼지고기와 김치를 함께 넣고 고기가 익을 때까지 충분히 볶아줍니다.",
      "물이 잠길 만큼 붓고 강불에서 끓이다가 끓어오르면 중불로 줄여 10분간 끓입니다.",
      "고춧가루, 다진 마늘, 국간장으로 간을 맞춰줍니다.",
      "마지막으로 썰어둔 두부, 대파, 양파를 넣고 3분간 더 끓여 완성합니다."
    ],
    description: "시큼하게 잘 익은 김치와 부드러운 두부, 담백한 돼지고기의 완벽한 조화"
  },
  {
    id: 3,
    title: "풍미 가득 파계란 볶음밥",
    category: "일품 요리",
    cookingTime: 12,
    difficulty: "매우 쉬움",
    calories: 420,
    isLowSugar: false,
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: [
      { name: "밥", amount: "1공기", isEssential: true },
      { name: "달걀", amount: "2개", isEssential: true },
      { name: "대파", amount: "1대", isEssential: true },
      { name: "햄", amount: "50g", isEssential: false }
    ],
    seasonings: "간장, 소금, 참기름, 식용유",
    instructions: [
      "대파는 송송 썰고, 햄은 잘게 주사위 모양으로 썰어줍니다.",
      "달걀은 미리 그릇에 깨서 부드럽게 풀어놓습니다.",
      "달군 팬에 기름을 넉넉히 두르고 대파를 먼저 넣어 은은하게 파기름을 냅니다.",
      "파 향이 솔솔 올라오면 햄을 넣어 함께 볶아줍니다.",
      "재료들을 팬 한쪽으로 몰아두고, 빈 공간에 달걀물을 부어 스크램블을 만듭니다.",
      "밥을 투하한 뒤 주걱을 세워 밥알을 가르듯이 고슬고슬하게 볶고, 팬 가장자리에 간장을 살짝 눌려 불맛을 입힙니다."
    ],
    description: "초간단 파기름으로 불맛 가득 맛집 볶음밥 재현"
  },
  {
    id: 4,
    title: "차돌박이 된장찌개",
    category: "찌개 / 국",
    cookingTime: 15,
    difficulty: "보통",
    calories: 390,
    isLowSugar: true,
    imageUrl: "https://images.unsplash.com/photo-1548943487-a2e4e43b4850?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: [
      { name: "두부", amount: "0.5모", isEssential: true },
      { name: "감자", amount: "1개", isEssential: true },
      { name: "대파", amount: "0.5대", isEssential: false },
      { name: "차돌박이", amount: "100g", isEssential: true },
      { name: "호박", amount: "1/4개", isEssential: false }
    ],
    seasonings: "된장, 다진 마늘, 물, 고춧가루",
    instructions: [
      "두부, 감자, 호박은 주사위 모양으로 한입 크기로 썰고 대파는 썰어둡니다.",
      "냄비에 차돌박이를 먼저 넣어 약불에서 기름이 나올 때까지 볶아줍니다.",
      "고기 기름이 나오면 물을 붓고 감자를 넣어 먼저 끓입니다.",
      "된장을 골고루 풀고 감자가 반쯤 익을 때까지 보글보글 끓여줍니다.",
      "나머지 호박, 두부를 넣고 다진 마늘과 고춧가루를 얹어 풍미를 더해 한소끔 더 끓입니다."
    ],
    description: "기름진 차돌박이 기름과 구수한 된장이 우러나 묵직하고 깊은 찌개"
  },
  {
    id: 5,
    title: "엄마 손맛 제육볶음",
    category: "메인 요리",
    cookingTime: 20,
    difficulty: "보통",
    calories: 520,
    isLowSugar: false,
    imageUrl: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=800&q=80",
    requiredIngredients: [
      { name: "돼지고기", amount: "300g", isEssential: true },
      { name: "양파", amount: "1개", isEssential: true },
      { name: "대파", amount: "1대", isEssential: false },
      { name: "양배추", amount: "100g", isEssential: false }
    ],
    seasonings: "고추장, 고춧가루, 간장, 설탕, 다진 마늘, 참기름",
    instructions: [
      "양파와 대파, 양배추는 한입 크기로 썰고 돼지고기도 먹기 좋은 크기로 분리합니다.",
      "고추장, 고춧가루, 간장, 설탕, 다진 마늘을 섞어 양념장을 완성합니다.",
      "돼지고기에 양념장을 조물조물 버무려 10분 정도 밑간을 해 둡니다.",
      "팬을 달구어 고기를 먼저 볶다가 절반쯤 익었을 때 양배추와 양파를 넣고 강불에서 빠르게 볶습니다.",
      "마지막에 대파와 참기름을 두르고 살짝 휘저어 마무리해 줍니다."
    ],
    description: "매콤 달콤한 특제 양념 소스에 야채의 아삭함이 그대로 느껴지는 밥도둑"
  }
];

// 테스트용 샘플 이미지 정보 매핑
const sampleImagesData = {
  diet: {
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "달걀", quantity: "6개", expiry: "12일 남음" },
      { name: "방울토마토", quantity: "15개", expiry: "5일 남음" },
      { name: "아보카도", quantity: "1개", expiry: "2일 남음" },
      { name: "양배추", quantity: "1/4통", expiry: "9일 남음" }
    ]
  },
  stew: {
    url: "https://images.unsplash.com/photo-1595981267035-7b04ec84a82d?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "두부", quantity: "1모", expiry: "4일 남음" },
      { name: "대파", quantity: "2대", expiry: "3일 남음" },
      { name: "양파", quantity: "1개", expiry: "8일 남음" },
      { name: "김치", quantity: "500g", expiry: "30일 남음" },
      { name: "감자", quantity: "2개", expiry: "14일 남음" }
    ]
  },
  meat: {
    url: "https://images.unsplash.com/photo-1553163147-622ab578d844?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      { name: "돼지고기", quantity: "300g", expiry: "2일 남음" },
      { name: "대파", quantity: "1대", expiry: "2일 남음" },
      { name: "양파", quantity: "2개", expiry: "7일 남음" },
      { name: "차돌박이", quantity: "150g", expiry: "5일 남음" }
    ]
  }
};

let uploadedBase64Image = null;
let selectedSampleType = null;
let activeInputTab = 'upload'; // 'upload' or 'sample'

// --- 초기 설정 구동 ---
window.onload = function() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  updateInventoryUI();
};

// --- 공통 알림 함수 (Toast) ---
function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `transform translate-y-2 opacity-0 transition-all duration-300 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white font-semibold text-sm ${
    type === 'success' ? 'bg-orange-500 shadow-orange-500/20' : 
    type === 'error' ? 'bg-red-500 shadow-red-500/20' : 'bg-slate-800'
  }`;
  
  let icon = "check-circle";
  if (type === "error") icon = "alert-circle";
  else if (type === "info") icon = "info";

  toast.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 flex-shrink-0"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 50);

  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- 입력 탭 전환 기능 ---
function switchInputTab(tab) {
  activeInputTab = tab;
  const tabUpload = document.getElementById("tab-upload");
  const tabSample = document.getElementById("tab-sample");
  const viewUpload = document.getElementById("view-upload");
  const viewSample = document.getElementById("view-sample");

  if (tab === 'upload') {
    tabUpload.className = "flex-1 text-center py-2 text-sm font-semibold rounded-lg bg-white text-slate-800 shadow-sm transition-all border border-orange-100";
    tabSample.className = "flex-1 text-center py-2 text-sm font-semibold rounded-lg text-orange-600 hover:text-orange-800 transition-all";
    viewUpload.classList.remove("hidden");
    viewSample.classList.add("hidden");
    if (uploadedBase64Image) {
      showPreview(uploadedBase64Image);
    } else {
      hidePreview();
    }
  } else {
    tabUpload.className = "flex-1 text-center py-2 text-sm font-semibold rounded-lg text-orange-600 hover:text-orange-800 transition-all";
    tabSample.className = "flex-1 text-center py-2 text-sm font-semibold rounded-lg bg-white text-slate-800 shadow-sm transition-all border border-orange-100";
    viewUpload.classList.add("hidden");
    viewSample.classList.remove("hidden");
    if (selectedSampleType) {
      showPreview(sampleImagesData[selectedSampleType].url);
    } else {
      hidePreview();
    }
  }
}

// --- 이미지 파일 선택 핸들러 ---
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedBase64Image = e.target.result;
    showPreview(uploadedBase64Image);
    document.getElementById("btn-analyze").disabled = false;
    showToast("이미지가 성공적으로 로드되었습니다. 분석을 클릭하세요.", "success");
  };
  reader.readAsDataURL(file);
}

// --- 샘플 이미지 선택 핸들러 ---
function selectSampleImage(type) {
  selectedSampleType = type;
  const data = sampleImagesData[type];
  showPreview(data.url);
  document.getElementById("btn-analyze").disabled = false;
  showToast(`${type === 'diet' ? '웰빙 다이어터' : type === 'stew' ? '국/찌개 마니아' : '고기 러버 자취생'} 샘플이 선택되었습니다.`, "info");
}

// --- 이미지 미리보기 노출 컨트롤 ---
function showPreview(src) {
  const previewArea = document.getElementById("preview-area");
  const previewImage = document.getElementById("preview-image");
  previewImage.src = src;
  previewArea.classList.remove("hidden");
}

function hidePreview() {
  document.getElementById("preview-area").classList.add("hidden");
  document.getElementById("btn-analyze").disabled = true;
}

function clearImage() {
  if (activeInputTab === 'upload') {
    uploadedBase64Image = null;
    document.getElementById("image-input").value = "";
  } else {
    selectedSampleType = null;
  }
  hidePreview();
}

// --- 식재료 AI 감지 실행 함수 ---
async function startImageAnalysis() {
  const overlay = document.getElementById("analyzer-overlay");
  const statusText = document.getElementById("analysis-status-text");
  overlay.classList.remove("hidden");

  if (activeInputTab === 'sample') {
    // 샘플 분석 시뮬레이션 가동
    const sampleData = sampleImagesData[selectedSampleType];
    let steps = ["식재료 외관 패턴 분석 중...", "패키징 필터링 및 노이즈 소거 중...", "매칭 목록 생성 중..."];
    
    for (let i = 0; i < steps.length; i++) {
      statusText.textContent = steps[i];
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // 기존 인벤토리에 샘플 식재료 결합 (중복 방지)
    sampleData.ingredients.forEach(item => {
      if (!myIngredients.some(i => i.name === item.name)) {
        myIngredients.push({ ...item });
      }
    });

    overlay.classList.add("hidden");
    updateInventoryUI();
    showToast("샘플 냉장고 구성 분석을 완료했습니다!", "success");
  } else {
    // 실제 유저 이미지 업로드 -> Gemini API 연결 로직
    try {
      if (!uploadedBase64Image) {
        throw new Error("업로드된 이미지 데이터가 누락되었습니다.");
      }

      statusText.textContent = "Gemini 2.5 Vision API 연결 중...";
      
      // Base64 가공
      const base64Parts = uploadedBase64Image.split(",");
      const mimeType = base64Parts[0].match(/data:(.*?);/)[1];
      const rawBase64 = base64Parts[1];

      const promptText = "당신은 냉장고 이미지 분석 전문가입니다. 이미지 내에 식별되는 모든 가시적인 식재료들의 한국어 이름을 추출해 주세요. 출력은 오직 반환 스키마에 정의된 형태의 JSON 데이터로만 응답하십시오. 조미료, 접시, 밀폐용기나 주방 도구는 무시하십시오.";
      
      const payload = {
        contents: [{
          role: "user",
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: mimeType,
                data: rawBase64
              }
            }
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              ingredients: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    confidence: { type: "NUMBER" }
                  },
                  required: ["name", "confidence"]
                }
              }
            },
            required: ["ingredients"]
          }
        }
      };

      statusText.textContent = "AI가 이미지를 정밀 분석 중입니다...";
      
      const responseText = await callGeminiWithBackoff(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        payload
      );

      const result = JSON.parse(responseText);
      const detectedList = result.ingredients || [];

      if (detectedList.length === 0) {
        showToast("냉장고에서 감지된 식재료가 없습니다. 다른 각도의 사진으로 시도해 주세요.", "error");
      } else {
        detectedList.forEach(item => {
          if (item.confidence > 0.5) {
            const standardizedName = item.name.trim();
            if (!myIngredients.some(i => i.name === standardizedName)) {
              myIngredients.push({
                name: standardizedName,
                quantity: "적당량",
                expiry: "7일 남음"
              });
            }
          }
        });
        showToast(`총 ${detectedList.length}개의 식재료 검출에 성공하였습니다!`, "success");
      }

    } catch (error) {
      console.error(error);
      showToast(`분석 실패: ${error.message}. 임시 샘플 모드로 요소를 강제 주입합니다.`, "error");
      
      // 비상 폴백
      const fallbackIngredients = ["김치", "돼지고기", "계란", "양파"];
      fallbackIngredients.forEach(name => {
        if (!myIngredients.some(i => i.name === name)) {
          myIngredients.push({ name: name, quantity: "적당량", expiry: "5일 남음" });
        }
      });
    } finally {
      overlay.classList.add("hidden");
      updateInventoryUI();
    }
  }
}

async function callGeminiWithBackoff(url, payload, maxRetries = 5) {
  let delay = 1000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status}`);
      }

      const resultData = await response.json();
      const textResponse = resultData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error("AI 응답 해석에 실패하였습니다.");
      }
      return textResponse;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

// --- 수동 식재료 주입 추가 핸들러 ---
function handleAddCustomIngredient(event) {
  event.preventDefault();
  const input = document.getElementById("input-new-ingredient");
  const name = input.value.trim();
  
  if (!name) return;

  if (myIngredients.some(i => i.name === name)) {
    showToast("이미 냉장고 보관함에 등록되어 있는 식재료입니다.", "error");
    return;
  }

  myIngredients.push({
    name: name,
    quantity: "적당량",
    expiry: "7일 남음"
  });

  input.value = "";
  updateInventoryUI();
  showToast(`'${name}' 식재료를 수동 등록하였습니다.`);
}

function deleteIngredient(index) {
  const removedName = myIngredients[index].name;
  myIngredients.splice(index, 1);
  updateInventoryUI();
  showToast(`'${removedName}' 식재료가 삭제되었습니다.`, "info");
}

function clearInventory() {
  myIngredients = [];
  updateInventoryUI();
  showToast("보관하고 있던 식재료 리스트가 모두 정리되었습니다.", "info");
}

// --- 인벤토리 UI 연동 리렌더링 ---
function updateInventoryUI() {
  const container = document.getElementById("inventory-list");
  
  if (myIngredients.length === 0) {
    container.innerHTML = `
      <div class="text-slate-400 text-xs w-full text-center py-6 flex flex-col items-center justify-center gap-1">
        <i data-lucide="package-open" class="w-8 h-8 text-slate-300"></i>
        등록된 재료가 없습니다. 사진을 분석하거나 직접 추가해 보세요.
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderRecipeList();
    return;
  }

  container.innerHTML = "";
  myIngredients.forEach((item, index) => {
    const itemChip = document.createElement("div");
    itemChip.className = "flex items-center gap-1.5 bg-orange-50 text-orange-800 border border-orange-200 rounded-full pl-3 pr-2.5 py-1.5 text-xs font-bold shadow-sm hover:border-orange-300 transition-all";
    itemChip.innerHTML = `
      <span>${item.name}</span>
      <span class="text-[10px] text-orange-500 font-medium bg-white px-1.5 py-0.5 rounded-full shadow-sm">${item.quantity}</span>
      <button onclick="deleteIngredient(${index})" class="text-orange-400 hover:text-orange-700 ml-1 hover:scale-110 transition-all">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;
    container.appendChild(itemChip);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
  renderRecipeList();
}

// --- 레시피 매칭 계산 및 목록 출력 ---
function renderRecipeList() {
  const container = document.getElementById("recipe-list");
  const excludeSeasonings = document.getElementById("exclude-seasonings").checked;
  const filterLowCalorie = document.getElementById("filter-low-calorie") ? document.getElementById("filter-low-calorie").checked : false;
  const filterLowSugar = document.getElementById("filter-low-sugar") ? document.getElementById("filter-low-sugar").checked : false;
  
  const userIngNames = myIngredients.map(item => item.name.trim());

  let scoredRecipes = localRecipeDatabase.map(recipe => {
    let reqList = recipe.requiredIngredients;
    const reqEssential = reqList.filter(item => item.isEssential).map(item => item.name);
    const reqOptional = reqList.filter(item => !item.isEssential).map(item => item.name);

    let matchCount = 0;
    let matchedList = [];
    let missingList = [];

    reqEssential.forEach(reqName => {
      if (userIngNames.includes(reqName)) {
        matchCount += 1.0;
        matchedList.push(reqName);
      } else {
        const substitution = findSubstitution(reqName, userIngNames);
        if (substitution) {
          matchCount += 0.8;
          matchedList.push(`${reqName}(대체: ${substitution})`);
        } else {
          missingList.push(reqName);
        }
      }
    });

    let matchingPercent = 0;
    if (reqEssential.length > 0) {
      matchingPercent = Math.min(100, Math.round((matchCount / reqEssential.length) * 100));
    }

    return {
      ...recipe,
      matchingPercent,
      matchedList,
      missingList
    };
  });

  // 추천 필터 적용
  if (filterLowCalorie) {
    scoredRecipes = scoredRecipes.filter(recipe => recipe.calories <= 400);
  }
  if (filterLowSugar) {
    scoredRecipes = scoredRecipes.filter(recipe => recipe.isLowSugar);
  }

  scoredRecipes.sort((a, b) => b.matchingPercent - a.matchingPercent);

  container.innerHTML = "";
  
  if (scoredRecipes.length === 0) {
    container.innerHTML = `
      <div class="text-slate-500 text-sm w-full text-center py-6 flex flex-col items-center justify-center gap-2">
        <i data-lucide="frown" class="w-8 h-8 text-slate-300"></i>
        <span>조건에 맞는 레시피가 없습니다. 필터를 해제해보세요.</span>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  scoredRecipes.forEach(recipe => {
    let progressColor = "bg-orange-500";
    let bgBadgeColor = "bg-orange-50 text-orange-700";
    if (recipe.matchingPercent < 40) {
      progressColor = "bg-rose-500";
      bgBadgeColor = "bg-rose-50 text-rose-700";
    } else if (recipe.matchingPercent < 80) {
      progressColor = "bg-amber-500";
      bgBadgeColor = "bg-amber-50 text-amber-700";
    }

    // 특징 태그 (저칼로리, 저혈당)
    let tagsHtml = "";
    if (recipe.calories <= 400) {
       tagsHtml += `<span class="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-md font-bold">저칼로리</span>`;
    }
    if (recipe.isLowSugar) {
       tagsHtml += `<span class="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-md font-bold">저혈당</span>`;
    }

    const itemHtml = document.createElement("div");
    itemHtml.className = "group bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md hover:border-orange-300";
    
    itemHtml.innerHTML = `
      <div class="flex-1 flex flex-col gap-1.5 w-full">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md">${recipe.category}</span>
          <span class="text-xs font-semibold text-slate-500 flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${recipe.cookingTime}분</span>
          ${tagsHtml}
        </div>
        <h4 class="text-base font-extrabold text-slate-900">${recipe.title}</h4>
        <p class="text-xs text-slate-500 line-clamp-1">${recipe.description}</p>
        
        <div class="flex flex-wrap gap-1 mt-1 text-[11px]">
          ${recipe.matchedList.map(n => `<span class="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md font-medium border border-orange-200">보유: ${n}</span>`).join('')}
          ${recipe.missingList.map(n => `<span class="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-medium border border-rose-100">필요: ${n}</span>`).join('')}
        </div>
      </div>

      <div class="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
        <div class="text-left md:text-right">
          <span class="text-[10px] text-slate-400 font-bold block">매칭률</span>
          <div class="flex items-center gap-2">
            <div class="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div class="${progressColor} h-full rounded-full" style="width: ${recipe.matchingPercent}%"></div>
            </div>
            <span class="text-sm font-black text-slate-800 ${bgBadgeColor} px-2 py-0.5 rounded-full border border-slate-100">${recipe.matchingPercent}%</span>
          </div>
        </div>

        <button onclick="openRecipeModal(${recipe.id}, ${recipe.matchingPercent})" class="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-1 min-w-max">
          조리법 보기 <i data-lucide="chevron-right" class="w-4.5 h-4.5"></i>
        </button>
      </div>
    `;
    container.appendChild(itemHtml);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function findSubstitution(name, userList) {
  const subs = {
    "대파": ["쪽파", "부추"],
    "돼지고기": ["소고기", "닭고기", "스팸", "차돌박이"],
    "두부": ["순두부", "버섯"],
    "햄": ["소시지", "돼지고기"],
    "김치": ["깍두기"]
  };

  if (subs[name]) {
    for (let s of subs[name]) {
      if (userList.includes(s)) return s;
    }
  }
  return null;
}

// --- 레시피 상세보기 모달 제어 ---
let currentSelectedRecipe = null;
function openRecipeModal(recipeId, matchedPercentage) {
  const recipe = localRecipeDatabase.find(r => r.id === recipeId);
  if (!recipe) return;

  currentSelectedRecipe = recipe;

  document.getElementById("modal-category").textContent = recipe.category;
  document.getElementById("modal-title").textContent = recipe.title;
  document.getElementById("modal-desc").textContent = recipe.description;
  document.getElementById("modal-time").textContent = `${recipe.cookingTime}분`;
  document.getElementById("modal-difficulty").textContent = recipe.difficulty;
  document.getElementById("modal-calories").textContent = `${recipe.calories} kcal`;

  // 이미지 렌더링 추가
  const modalImageContainer = document.getElementById("modal-image-container");
  const modalImage = document.getElementById("modal-image");
  if (recipe.imageUrl) {
    modalImage.src = recipe.imageUrl;
    modalImageContainer.classList.remove("hidden");
  } else {
    modalImageContainer.classList.add("hidden");
  }

  const ingredientsContainer = document.getElementById("modal-ingredients");
  ingredientsContainer.innerHTML = "";
  
  const userIngNames = myIngredients.map(i => i.name);
  
  recipe.requiredIngredients.forEach(ing => {
    const isOwned = userIngNames.includes(ing.name) || findSubstitution(ing.name, userIngNames);
    const card = document.createElement("div");
    card.className = `flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
      isOwned ? 'bg-orange-50/80 border-orange-200 text-slate-800' : 'bg-rose-50/50 border-rose-200 text-rose-900'
    }`;
    card.innerHTML = `
      <div class="flex items-center gap-2">
        <i data-lucide="${isOwned ? 'check-circle' : 'help-circle'}" class="w-4 h-4 ${isOwned ? 'text-orange-500' : 'text-rose-400'}"></i>
        <span>${ing.name} <span class="text-[10px] text-slate-400 font-medium">(${ing.amount})</span></span>
      </div>
      <span class="text-[10px] px-1.5 py-0.5 rounded-md ${isOwned ? 'bg-orange-100 text-orange-800' : 'bg-rose-100 text-rose-800'}">
        ${isOwned ? '준비 완료' : '부족함'}
      </span>
    `;
    ingredientsContainer.appendChild(card);
  });

  document.getElementById("modal-seasonings").textContent = recipe.seasonings;

  const stepsContainer = document.getElementById("modal-steps");
  stepsContainer.innerHTML = "";
  recipe.instructions.forEach((step, idx) => {
    const item = document.createElement("label");
    item.className = "flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-all group";
    item.innerHTML = `
      <input type="checkbox" class="mt-1 rounded border-slate-300 text-orange-500 focus:ring-orange-500">
      <div class="flex flex-col">
        <span class="text-[10px] font-black text-orange-500 uppercase tracking-wider">Step ${idx+1}</span>
        <span class="text-xs text-slate-700 leading-relaxed font-semibold group-hover:text-slate-900 transition-all">${step}</span>
      </div>
    `;
    stepsContainer.appendChild(item);
  });

  const modal = document.getElementById("recipe-modal");
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    modal.firstElementChild.classList.remove("scale-95");
  }, 50);

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeRecipeModal() {
  const modal = document.getElementById("recipe-modal");
  modal.classList.add("opacity-0");
  modal.firstElementChild.classList.add("scale-95");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 300);
}

function buyMissingIngredients() {
  if (!currentSelectedRecipe) return;
  const userIngNames = myIngredients.map(i => i.name);
  const missing = currentSelectedRecipe.requiredIngredients
    .filter(ing => !userIngNames.includes(ing.name) && !findSubstitution(ing.name, userIngNames))
    .map(ing => ing.name);

  if (missing.length === 0) {
    showToast("모든 재료를 확보하고 있습니다! 추가 구매가 불필요합니다.", "success");
    return;
  }

  const encodedQuery = encodeURIComponent(missing.join(', '));
  showToast(`부족한 재료 [${missing.join(', ')}]를 가상의 쇼핑 백에 담았습니다!`, "info");
  
  setTimeout(() => {
    window.open(`https://msearch.shopping.naver.com/search/all?query=${encodedQuery}`, '_blank');
  }, 1000);
}

// --- 4. Gemini 실시간 AI 맞춤 레시피 빌더 ---
async function generateCustomAIQuery() {
  if (myIngredients.length === 0) {
    showToast("AI 셰프를 소환하기 전 최소 1개 이상의 보관함 재료를 확보해 주세요.", "error");
    return;
  }

  const filterLowCalorie = document.getElementById("filter-low-calorie") ? document.getElementById("filter-low-calorie").checked : false;
  const filterLowSugar = document.getElementById("filter-low-sugar") ? document.getElementById("filter-low-sugar").checked : false;
  
  const initBox = document.getElementById("ai-recipe-init");
  const loadingBox = document.getElementById("ai-recipe-loading");
  const contentBox = document.getElementById("ai-recipe-content");

  initBox.classList.add("hidden");
  loadingBox.classList.remove("hidden");
  contentBox.classList.add("hidden");

  const ingredientListStr = myIngredients.map(item => `${item.name}(${item.quantity})`).join(", ");

  let constraintText = "";
  if (filterLowCalorie || filterLowSugar) {
    let constraints = [];
    if (filterLowCalorie) constraints.push("400kcal 이하의 저칼로리");
    if (filterLowSugar) constraints.push("당류를 최소화한 저혈당");
    constraintText = ` 특히 이 요리는 ${constraints.join(" 및 ")} 식단이어야 합니다.`;
  }

  const systemPrompt = `당신은 한일/퓨전 양식 일류 셰프입니다. 사용자가 보유한 제한된 식재료들을 기적적으로 구성하여 가장 창의적이고 맛있는 퓨전 요리 레시피 1종을 설계해야 합니다. 출력은 가독성 높은 HTML 코드로 작성하십시오. h4, p, ul, li, strong 등의 HTML 태그를 사용하며, 화려하고 따뜻한 어조로 인사와 조리 단계를 상세하게 풀어주세요.${constraintText}`;
  const userPrompt = `제가 가진 재료: [${ingredientListStr}]. 기본 조미료는 자유롭게 사용 가능합니다. 이 재료들을 조합한 하나의 특제 요리 이름, 설명, 요리의 장점, 조리 방법을 HTML 형식으로 아름답고 가독성 좋게 출력해주세요.`;

  const payload = {
    contents: [{
      parts: [{ text: userPrompt }]
    }],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    }
  };

  try {
    const textResponse = await callGeminiWithBackoff(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      payload
    );

    let cleanedHtml = textResponse.replace(/```html/gi, "").replace(/```/g, "").trim();

    loadingBox.classList.add("hidden");
    contentBox.innerHTML = `
      <div class="border-l-4 border-indigo-500 pl-4 py-1 mb-4 bg-indigo-50/50 rounded-r-xl p-3">
        <span class="text-xs font-bold text-indigo-600 block">AI 수석 셰프의 추천 특선 요리</span>
      </div>
      <div class="prose max-w-none text-slate-700 text-xs leading-relaxed flex flex-col gap-3">
        ${cleanedHtml}
      </div>
      <button onclick="resetAIScreen()" class="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all flex items-center gap-1 self-end">
        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> 초기화
      </button>
    `;
    contentBox.classList.remove("hidden");
    if (typeof lucide !== 'undefined') lucide.createIcons();
    showToast("AI 특선 시그니처 큐레이션 요리가 탄생했습니다!", "success");

  } catch (error) {
    console.error(error);
    loadingBox.classList.add("hidden");
    
    contentBox.innerHTML = `
      <div class="border-l-4 border-red-500 pl-4 py-1 mb-4 bg-red-50/50 rounded-r-xl p-3">
        <span class="text-xs font-bold text-red-600 block">AI 셰프 제안 실패 (폴백 가이드)</span>
      </div>
      <h4 class="text-sm font-extrabold text-slate-900">영양 가득 잡채풍 야채 볶음</h4>
      <p class="text-xs text-slate-600">현재 보관된 재료들을 길게 채 썰어 굴소스와 소금으로 빠르게 볶아낸 고소한 볶음 요리입니다. 밥 반찬으로 훌륭합니다.</p>
      <ul class="list-disc pl-5 text-xs text-slate-600 flex flex-col gap-1 mt-2">
        <li><strong>Step 1:</strong> 야채 재료들을 일정한 길이로 균일하게 채 썹니다.</li>
        <li><strong>Step 2:</strong> 달군 팬에 식용유를 두르고 마늘을 볶아 향을 냅니다.</li>
        <li><strong>Step 3:</strong> 단단한 야채부터 고기 순으로 소금 간을 하며 강불에서 볶아 마무리합니다.</li>
      </ul>
      <button onclick="resetAIScreen()" class="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all flex items-center gap-1 self-end">
        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> 초기화
      </button>
    `;
    contentBox.classList.remove("hidden");
    if (typeof lucide !== 'undefined') lucide.createIcons();
    showToast("서버 연결 일시 불안정으로 로컬 시뮬레이션 대체 가이드를 실행합니다.", "error");
  }
}

function resetAIScreen() {
  document.getElementById("ai-recipe-init").classList.remove("hidden");
  document.getElementById("ai-recipe-content").classList.add("hidden");
}
