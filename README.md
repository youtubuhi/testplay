# TEST PLAY — 테스트 추가형 플랫폼

## 1. 평소에 수정하는 곳 (🟢)

- `src/content/tests/`: 테스트당 JS 파일 하나. 제목, 질문, 선택지, 점수, 결과, 화면 설정을 여기서 관리합니다.
- `public/images/`: 표지 및 결과 이미지. 새 테스트마다 ID와 같은 이름의 폴더를 만드는 것을 권장합니다.
- `templates/`: 새 테스트를 만들 때 복사하는 예제 3종. 이 폴더에 있는 파일은 사이트에 등록되지 않습니다.
- `src/content/site.js`: 사이트명, 인스타그램, 카테고리 및 광고 위치 설정. 보통 수정할 필요 없습니다.

나머지 `src/core`, `src/main.jsx`, `src/style.css`, `scripts`, `.github`, `index.html` 등은 공통 시스템입니다. 새로운 일반 테스트를 추가할 때 수정하지 마세요.

## 2. 세 번째 테스트 추가하기

1. ChatGPT와 테스트 기획을 완료합니다.
2. 계산 방식을 골라 `templates/score.js` (점수 합산), `templates/type.js` (유형 점수), `templates/dimension.js` (성향 조합) 중 하나를 복사합니다. 기존 테스트 파일을 복사해도 됩니다.
3. `id`, 제목, 질문, 결과 등을 입력하고 `src/content/tests/새-ID.js`로 저장합니다. ID는 영문 소문자, 숫자, 하이픈만 사용하고 중복되지 않게 합니다.
4. 필요하면 `public/images/새-ID/`에 이미지를 넣고 파일에서 이미지 경로를 설정합니다. 이미지가 없다면 이모지를 사용합니다.
5. `published: true`로 변경한 후 GitHub에 새 파일 및 이미지만 업로드합니다. `index.js`나 목록을 편집할 필요가 없습니다.
6. GitHub Actions에서 배포 성공 여부를 확인합니다. 주소는 `https://youtubuhi.github.io/testplay/test/새-ID/`입니다.

공개 전에는 `published: false`로 두세요. 비공개는 목록과 직접 접속에서 숨기는 기능이며, 기밀 데이터를 보관하는 기능은 아닙니다.

## 3. 악마 테스트 수정

`src/content/tests/devil-score.js`만 열면 됩니다.

```js
{ text: '질문 문구', options: [
  ['선택지 A', 0],
  ['선택지 B', 2],
  ['선택지 C', 1],
  ['선택지 D', 3],
] },
```

따옴표 안은 실제로 보여지는 문구, 쉼표 뒤 숫자는 점수입니다. 점수 순서나 중복은 자유롭습니다. 질문별 최대 점수의 합을 기준으로 백분율이 자동 계산됩니다. 현재 10문항, 0~28점입니다.

결과는 `results` 안에 있습니다. 각 결과의 `min`, `max`는 양끝을 포함합니다. 가능한 최저~최고 점수에 누락이나 중복이 없도록 설정합니다. 점수나 질문 수를 바꾸면 필요한 경우 결과 범위도 조정하세요.

```js
level4: {
  min: 13, max: 17,
  title: '생활형 악마',
  subtitle: '양심도 상황에 따라 유동적으로 운영합니다.',
  emoji: '😈',
  color: '#EADBF7',
  description: '상세 설명',
  traits: ['지옥 내 직급: 대리', '주요 특기: 선택적 양심'],
},
```

## 4. 이미지 추가

악마 테스트의 표지: `public/images/devil-score/cover.png`에 저장. 파일 안에서 다음 두 줄의 주석(//)을 제거합니다.

```js
thumbnail: '/images/devil-score/cover.png',
shareImage: '/images/devil-score/cover.png',
```

결과 이미지: 같은 폴더에 `level1.png` ~ `level6.png`를 업로드하고 각 결과에 `image: '/images/devil-score/level1.png',`처럼 해당 경로를 추가합니다. 표지는 정사각형 권장, SNS 전용 이미지는 1200×630 권장, 결과 이미지는 투명 PNG 또는 정사각형 권장. 기존 이모지 표지의 경로는 이전 링크 보존을 위해 유지했습니다.

질문 이미지: 질문 객체 안에 `image: '/images/새-ID/question1.png',`를 추가합니다.
점수형 이미지 선택지: `['선택지 문구', 2, '/images/새-ID/option1.png']`.
다른 계산 방식의 이미지 선택지: `{text:'선택지 문구', image:'/images/새-ID/option1.png', scores:{a:1}}`처럼 기존 점수 또는 signals 설정에 image를 추가합니다.

## 5. 테스트별 선택 설정

- `category`: 'personality'(성격), 'love'(연애), 'relationship'(인간관계), 'fun'(기타). 배열로 복수 카테고리 지정 가능.
- `keywords`: 검색 키워드 배열. `createdAt`: YYYY-MM-DD. 최신순 및 등록 후 14일 NEW 표시.
- `featured: true`: 추천 영역에 표시 (실제 인기 순위 아님).
- `accent`: 버튼과 진행률 강조 색. `theme`: 기존 표지 테마 클래스. `color`: 결과별 배경.
- `resultHeading`, `descriptionHeading`: 각 결과 화면 제목. 없으면 숨김.
- `showScore: true`, `scoreLabel`: 점수 합산형 결과의 백분율 표시.
- `showResultImage: false`: 결과 이미지 영역 숨김.
- 결과 `subtitle`, `description`, `traits`, `compatibility`: 생략하면 해당 내용 숨김. compatibility 예시: `{'잘 맞는 유형':'A','상극':'B'}`.
- `recommendations: false`: 다른 테스트 추천 숨김. 기본은 현재 테스트를 제외한 같은 카테고리 우선 추천.
- `shareTitle`, `shareDescription`, `shareImage`: SNS 미리보기. 지정하지 않으면 기본값 사용.

## 6. 이번 업데이트 설치 방법 (한 번만)

이 ZIP은 2026-11-24에 제공받은 참고 ZIP을 기반으로 수정한 전체 소스입니다. 실제 GitHub에서 별도로 수정한 내용이 있으면 먼저 백업하고 비교하세요.
압축을 풀고 기존 저장소의 동일한 경로에 수정 파일을 교체/추가합니다. `.github` 같은 숨김 폴더도 포함되어 있습니다. 기존 저장소 전체를 삭제하거나 새 저장소를 만들 필요는 없습니다. 이후에는 새 테스트 파일과 이미지만 추가합니다.

로컬에서 확인할 경우 Node.js 22 설치 후 프로젝트 폴더에서 `npm install`, `npm run dev` 실행. `npm run build`는 콘텐츠 검증, Vite 빌드, OG 페이지/사이트맵 생성 순서입니다. `npm run check`는 콘텐츠 및 계산 검증입니다.

## 7. 운영 및 검증

GA4 기존 ID를 유지하고 테스트 방문, 시작, 질문 진행, 완료/결과 유형, 링크 복사, 공유, 이미지 복사 성공, 추천 클릭 이벤트를 추가했습니다. GA4에서 test_id 등 사용자 정의 측정기준을 등록하면 분석에 활용할 수 있습니다. 개별 선택지 문구는 전송하지 않습니다.
광고는 `site.js`의 ads 설정을 비워 두었고 광고 스크립트는 아직 연결하지 않았습니다. 실제 광고 연동은 별도 작업입니다.
기존 이모지와 악마 테스트 계산, 콘텐츠 검증, 템플릿, 임시 세 번째 테스트의 OG/사이트맵 생성 및 JSX 구문 검사를 수행했습니다. 현재 작업 환경에서는 npm 다운로드가 불가능하여 전체 Vite 빌드와 실제 브라우저/클립보드 테스트는 하지 못했습니다. GitHub Actions 성공 여부와 실제 모바일 화면을 확인하세요.
