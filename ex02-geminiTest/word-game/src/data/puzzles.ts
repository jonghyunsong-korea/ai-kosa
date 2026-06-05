import { PuzzleLevel } from '../types';

export const DICTIONARY: { word: string; clue: string }[] = [
  { word: '사과', clue: '빨갛고 단맛이 돌며 아침에 먹으면 보약이라 불리는 과일' },
  { word: '사자', clue: '갈기가 멋진 아프리카 초원의 대형 고양잇과 동물' },
  { word: '과자', clue: '밀가루 등으로 구워 만든 아이들이 좋아하는 바삭바삭한 간식' },
  { word: '자전거', clue: '체인과 페달을 두 발로 밟아 바퀴를 굴려서 가는 교통수단' },
  { word: '거미', clue: '거미줄을 방사형으로 치며 곤충을 잡아먹는 여덟 다리 절지동물' },
  { word: '미술', clue: '그림, 조각, 디자인 등으로 미적 감각을 표현하는 시각 예술' },
  { word: '나무', clue: '단단한 줄기와 많은 가지, 잎이 우거진 목본 식물'
  },
  { word: '어머니', clue: '자녀를 낳아 길러 주신 숭고하고 따뜻한 존재' },
  { word: '지구', clue: '우리가 살고 있는 태양계의 세 번째 푸른 행성' },
  { word: '구름', clue: '하늘에 떠 있는 물방울이나 미세한 얼음 결정들의 모임' },
  { word: '우주', clue: '끝없이 넓고 무한한 천체 공간 전체' },
  { word: '별나라', clue: '별들이 가득 모여 사는 동화 속 상상의 세상' },
  { word: '기차', clue: '철도 레일 위를 달리는 승객과 화물 수송용 연접 차량' },
  { word: '차표', clue: '열차나 버스 등의 대중교통 승차권' },
  { word: '표정', clue: '감정이나 생각이 얼굴 생김새나 눈빛에 드러나는 상태' },
  { word: '정리', clue: '물건이나 서류 등을 정돈하여 깨끗하게 처리하는 행동' },
  { word: '리본', clue: '보통 머리나 포장 상자 등에 묶는 장식용 끈' },
  { word: '선물', clue: '고마움이나 축하의 마음을 표현하기 위해 상대방에게 주는 물건' },
  { word: '물개', clue: '바다에서 물고기를 잡고 살며 육지에서도 기어다니는 포유동물' },
  { word: '개구리', clue: '올챙이에서 자라나며 논이나 연못가에서 울어대는 양서류' },
  { word: '두부', clue: '콩으로 만든 고단백 식품으로 찌개나 부침에 쓰이는 음식' },
  { word: '바나나', clue: '길쭉한 곡선 모양에 노란 껍질을 지닌 달콤한 열대 과일' },
  { word: '수박', clue: '여름철 먹는 크고 둥근 초록빛 줄무늬 물 과일' },
  { word: '학교', clue: '학생들이 모여 배움을 얻고 공부하는 공공 교육 기관' },
  { word: '교실', clue: '학교에서 선생님과 학생들이 수업을 진행하는 배움의 방' },
  { word: '실내', clue: '방이나 건물 등의 안쪽 공간' },
  { word: '내부', clue: '조직이나 사물의 한가운데 혹은 안쪽 면' },
  { word: '부모', clue: '어버이가 되는 아버지와 어머니를 아울러 이르는 말' },
  { word: '하늘', clue: '지상에서 올려다 보이는 넓고 푸른 상공' },
  { word: '가을', clue: '여름이 지나 산과 들이 붉게 물들며 곡식이 익는 수확의 계절' },
  { word: '여름', clue: '강렬한 햇빛에 장마와 더위가 기승을 부리는 계절' },
  { word: '수영장', clue: '물놀이를 하거나 수영 경기와 훈련을 할 수 있게 만든 시설' },
  { word: '휴가', clue: '일이나 학업을 잠시 쉬며 즐기는 피서나 휴식 기간' },
  { word: '노래', clue: '목소리와 운율을 실어 감정을 표현하는 음악 곡조' },
  { word: '가방', clue: '책이나 옷, 필기도구 등을 넣어 들고 다닐 수 있는 어깨끈 달린 보관용 도구' },
  { word: '방학', clue: '학교 교육 과정 중 여름이나 겨울에 오랫동안 쉬는 기간' },
  { word: '학습', clue: '새로운 기술이나 지식을 습득하고 익히는 과정' },
  { word: '영화', clue: '연기자들의 움직임과 음향을 필름에 담아 상영하는 대중 예술' },
  { word: '소리', clue: '귀에 들리는 청각적인 진동이나 목소리' },
  { word: '바람', clue: '공기의 이동에 의해 발생하는 대기의 흐름' },
  { word: '한국', clue: '아시아 동쪽에 자리한 반도 국가로 한글을 공용어로 씀' },
  { word: '가족', clue: '혼인이나 혈연 등으로 맺어져 한집안을 이룬 친근한 공동체' },
  { word: '김치', clue: '배추나 무를 소금에 절여 고춧가루 복합 양념에 발효시킨 전통 반찬' },
  { word: '치약', clue: '칫솔에 묻혀 이를 닦고 위생을 관리하는 점액성 세정제' },
  { word: '약속', clue: '다른 사람과 앞으로 일을 어떻게 하기로 정하고 다짐하는 조치' },
  { word: '속기', clue: '말을 빠른 속도로 기록하여 글자로 옮기는 전문 기술' },
  { word: '기자', clue: '신문사나 방송국에서 취재를 하여 뉴스를 작성하는 직업인' },
  { word: '도서관', clue: '엄청난 양의 책들을 수집 보관하고 독서와 연구를 지원하는 공간' },
  { word: '안경', clue: '시력이 나빠 앞이 흐릿할 때 눈앞에 걸쳐 잘 보이도록 돕는 유리 도구' },
  { word: '필통', clue: '연필, 자, 지우개 등의 필기도구를 넣어서 보관하는 작은 휴대 상자' }
];

export const PUZZLES: PuzzleLevel[] = [
  {
    id: 'level-1',
    name: '1단계: 동물과 예술 (4x4)',
    size: 4,
    words: [
      {
        id: 'L1-H1',
        word: '사자',
        clue: '갈기가 멋진 동물원의 야수로 흔히 초원의 왕이라 불려요.',
        orientation: 'horizontal',
        row: 0,
        col: 0,
        length: 2
      },
      {
        id: 'L1-V1',
        word: '자전거',
        clue: '두 개의 페달을 번갈아 가며 밟아 굴려가는 친환경 교통수단.',
        orientation: 'vertical',
        row: 0,
        col: 1,
        length: 3
      },
      {
        id: 'L1-H2',
        word: '거미',
        clue: '줄을 겹겹이 쳐서 나비나 파리를 잡아먹으며 사는 여덟 다리 동물.',
        orientation: 'horizontal',
        row: 2,
        col: 1,
        length: 2
      },
      {
        id: 'L1-V2',
        word: '미술',
        clue: '붓과 도화지로 그림을 그리거나 찰흙공예 등을 하는 공간/시각 예술.',
        orientation: 'vertical',
        row: 2,
        col: 2,
        length: 2
      }
    ],
    grid: {
      blockedCells: [
        [0, 2], [0, 3],
        [1, 0], [1, 2], [1, 3],
        [2, 0], [2, 3],
        [3, 0], [3, 1], [3, 3]
      ],
      fixedCells: [
        { row: 0, col: 0, letter: '사' } // Gives one free letter
      ]
    }
  },
  {
    id: 'level-2',
    name: '2단계: 여행과 교통 (5x5)',
    size: 5,
    words: [
      {
        id: 'L2-H1',
        word: '기차',
        clue: '철로 위를 칙칙폭폭 소리를 내며 긴 열을 지어 달리는 탈것.',
        orientation: 'horizontal',
        row: 0,
        col: 0,
        length: 2
      },
      {
        id: 'L2-V1',
        word: '차표',
        clue: '기차나 버스에 정당하게 탑승하기 위해서 돈을 주고사서 보여주는 표.',
        orientation: 'vertical',
        row: 0,
        col: 1,
        length: 2
      },
      {
        id: 'L2-H2',
        word: '표정',
        clue: '마음의 감정이 눈, 코, 입, 그리고 얼굴 표면에 피어나는 모습.',
        orientation: 'horizontal',
        row: 1,
        col: 1,
        length: 2
      },
      {
        id: 'L2-V2',
        word: '정리',
        clue: '책상 위나 옷장을 쓸데없는 건 버리고 질서 있게 배치해 정돈해놓은 일.',
        orientation: 'vertical',
        row: 1,
        col: 2,
        length: 2
      },
      {
        id: 'L2-H3',
        word: '리본',
        clue: '선물 상자에 매거나 머리띠를 장식할 때 쓰는 예쁜 나비 형태의 넓적한 끈.',
        orientation: 'horizontal',
        row: 2,
        col: 2,
        length: 2
      },
      {
        id: 'L2-V3',
        word: '본부',
        clue: '어떤 조직이나 단체에서 행사나 계획의 중심 및 지휘를 담당하는 본가.',
        orientation: 'vertical',
        row: 2,
        col: 3,
        length: 2
      },
      {
        id: 'L2-H4',
        word: '부모',
        clue: '어머니와 아버지를 조화롭고 점잖게 함께 일컫는 칭호.',
        orientation: 'horizontal',
        row: 3,
        col: 3,
        length: 2
      }
    ],
    grid: {
      blockedCells: [
        [0, 2], [0, 3], [0, 4],
        [1, 0], [1, 3], [1, 4],
        [2, 0], [2, 1], [2, 4],
        [3, 0], [3, 1], [3, 2],
        [4, 0], [4, 1], [4, 2], [4, 3], [4, 4]
      ],
      fixedCells: [
        { row: 0, col: 0, letter: '기' }
      ]
    }
  },
  {
    id: 'level-3',
    name: '3단계: 배움터와 환경 (5x5)',
    size: 5,
    words: [
      {
        id: 'L3-H1',
        word: '학교',
        clue: '학생들이 아침마다 등교하여 바르게 공부하고 뛰어노는 주 교육 터.',
        orientation: 'horizontal',
        row: 0,
        col: 0,
        length: 2
      },
      {
        id: 'L3-V1',
        word: '교실',
        clue: '칠판과 책상이 비치되어 있으며 수업이 실제로 진행되는 공부방.',
        orientation: 'vertical',
        row: 0,
        col: 1,
        length: 2
      },
      {
        id: 'L3-H2',
        word: '실내',
        clue: '방이나 건물 따위의 외부가 아닌 안쪽 공간.',
        orientation: 'horizontal',
        row: 1,
        col: 1,
        length: 2
      },
      {
        id: 'L3-V2',
        word: '내용',
        clue: '그릇에 담긴 물품이나, 책/영화가 전하고자 하는 실질적인 이야기 핵심.',
        orientation: 'vertical',
        row: 1,
        col: 2,
        length: 2
      },
      {
        id: 'L3-H3',
        word: '용기',
        clue: '겁을 내지 않고 옳다고 굳게 생각하는 것을 밀고 나가는 씩씩한 기운.',
        orientation: 'horizontal',
        row: 2,
        col: 2,
        length: 2
      },
      {
        id: 'L3-V3',
        word: '기상',
        clue: '태풍이나 비, 눈, 구름 등 하늘에서 일어나는 대기의 상태나 예보.',
        orientation: 'vertical',
        row: 2,
        col: 3,
        length: 2
      },
      {
        id: 'L3-H4',
        word: '상자',
        clue: '장난감이나 소품을 담아 뚜껑을 닫아두는 종이 또는 나무 보관 통.',
        orientation: 'horizontal',
        row: 3,
        col: 3,
        length: 2
      }
    ],
    grid: {
      blockedCells: [
        [0, 2], [0, 3], [0, 4],
        [1, 0], [1, 3], [1, 4],
        [2, 0], [2, 1], [2, 4],
        [3, 0], [3, 1], [3, 2],
        [4, 0], [4, 1], [4, 2], [4, 3], [4, 4]
      ],
      fixedCells: [
        { row: 1, col: 1, letter: '실' }
      ]
    }
  },
  {
    id: 'level-4',
    name: '4단계: 자연의 하모니 (6x6)',
    size: 6,
    words: [
      {
        id: 'L4-H1',
        word: '여름',
        clue: '사계절 중 매미가 울고 가장 더우며 휴가를 떠나는 뜨거운 계절.',
        orientation: 'horizontal',
        row: 0,
        col: 0,
        length: 2
      },
      {
        id: 'L4-V1',
        word: '음악',
        clue: '아름다운 소리들의 높낮이와 리듬으로 감동을 자아내는 소리 예술.',
        orientation: 'vertical',
        row: 0,
        col: 1,
        length: 2
      },
      {
        id: 'L4-H2',
        word: '학생',
        clue: '학교 등의 배움터에서 전문적인 지식을 수양하는 학습 당사자.',
        orientation: 'horizontal',
        row: 1,
        col: 1,
        length: 2
      },
      {
        id: 'L4-V2',
        word: '생활',
        clue: '구름 가듯 평범하게 일상 속에서 활동하며 매일을 살아가는 행위.',
        orientation: 'vertical',
        row: 1,
        col: 2,
        length: 2
      },
      {
        id: 'L4-H3',
        word: '활력',
        clue: '몸속에서 샘솟는 활기차고 넘치는 건강한 생체 에너지.',
        orientation: 'horizontal',
        row: 2,
        col: 2,
        length: 2
      },
      {
        id: 'L4-V3',
        word: '역사',
        clue: '인간 사회가 그동안 밟아 온 과거 사건들과 발자취 및 기록.',
        orientation: 'vertical',
        row: 2,
        col: 3,
        length: 2
      },
      {
        id: 'L4-H4',
        word: '사막',
        clue: '모래가 끝없이 펼쳐져 있고 선인장과 낙타가 사는 매우 건조하고 비가 안오는 벌판.',
        orientation: 'horizontal',
        row: 3,
        col: 3,
        length: 2
      },
      {
        id: 'L4-V4',
        word: '막차',
        clue: '하루의 노선 운행 중 가장 마지막에 정류장을 출발하는 대중 버스나 지하철.',
        orientation: 'vertical',
        row: 3,
        col: 4,
        length: 2
      },
      {
        id: 'L4-H5',
        word: '차고',
        clue: '눈이나 비로부터 차량을 보호하기 위해 자동차를 주차해 두는 집 안 창고.',
        orientation: 'horizontal',
        row: 4,
        col: 4,
        length: 2
      }
    ],
    grid: {
      blockedCells: [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 0], [1, 3], [1, 4], [1, 5],
        [2, 0], [2, 1], [2, 4], [2, 5],
        [3, 0], [3, 1], [3, 2], [3, 5],
        [4, 0], [4, 1], [4, 2], [4, 3],
        [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]
      ],
      fixedCells: [
        { row: 0, col: 0, letter: '여' },
        { row: 3, col: 3, letter: '사' }
      ]
    }
  },
  {
    id: 'level-5',
    name: '5단계: 사랑과 지혜 (6x6)',
    size: 6,
    words: [
      {
        id: 'L5-H1',
        word: '가족',
        clue: '한 지붕 아래에서 같이 식사를 하며 정을 나누어 맺는 가장 친밀한 운명 공동체.',
        orientation: 'horizontal',
        row: 0,
        col: 0,
        length: 2
      },
      {
        id: 'L5-V1',
        word: '족장',
        clue: '원시 부족의 우두머리로 세력을 이끌고 의사결정을 하는 지도자.',
        orientation: 'vertical',
        row: 0,
        col: 1,
        length: 2
      },
      {
        id: 'L5-H2',
        word: '장바구니',
        clue: '마트나 시장에서 구매할 물건들을 편리하게 쓸어 담아 들고 다닐 수 있는 담개 주머니장.',
        orientation: 'horizontal',
        row: 1,
        col: 1,
        length: 4
      },
      {
        id: 'L5-V2',
        word: '구두',
        clue: '가죽 등으로 발끝이 뾰족하고 매끄러우며 결혼식이나 격식 차릴 때 신는 신발.',
        orientation: 'vertical',
        row: 1,
        col: 3,
        length: 2
      },
      {
        id: 'L5-H3',
        word: '두부',
        clue: '하얀 모 형태로 대두를 끓여 굳힌 한국 밥상에 빠질 수 없는 부드러운 고단백 웰빙 음식.',
        orientation: 'horizontal',
        row: 2,
        col: 3,
        length: 2
      },
      {
        id: 'L5-V3',
        word: '부모',
        clue: '자신을 세속에 탄생하게 해주신 고맙고 사랑이 담긴 어머니와 아버지.',
        orientation: 'vertical',
        row: 2,
        col: 4,
        length: 2
      },
      {
        id: 'L5-H4',
        word: '모자',
        clue: '햇빛을 가리기 위해 혹은 안 꾸민 얼굴이나 헤어스타일을 숨기기 위해 머리 위에 쓰는 덮개.',
        orientation: 'horizontal',
        row: 3,
        col: 4,
        length: 2
      }
    ],
    grid: {
      blockedCells: [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 0], [1, 5],
        [2, 0], [2, 1], [2, 2], [2, 5],
        [3, 0], [3, 1], [3, 2], [3, 3], [3, 5],
        [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
        [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]
      ],
      fixedCells: [
        { row: 1, col: 2, letter: '바' },
        { row: 1, col: 4, letter: '니' }
      ]
    }
  }
];
