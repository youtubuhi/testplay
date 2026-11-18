## GitHub Pages 배포 — youtubuhi/testplay

1. 이 ZIP을 **압축 해제**합니다.
2. `testplay-github-ready` 폴더 **안의 모든 파일과 폴더**를 GitHub 저장소 `youtubuhi/testplay`의 **Add file → Upload files**로 올립니다. `.github` 폴더도 꼭 업로드하세요. (ZIP 자체 업로드 금지)
3. 아래쪽 **Commit changes**를 누릅니다.
4. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
5. 저장소 **Actions** 메뉴에서 Deploy TEST PLAY workflow 성공을 확인합니다.
6. https://youtubuhi.github.io/testplay/ 접속합니다.

> GitHub Pages는 정적 무료 호스팅입니다. 기본 주소에는 `/testplay/`가 포함됩니다.
> 나중에 저장소 이름을 바꾸면 `vite.config.js`의 `base` 값도 바꿔야 합니다.
> 모바일 기본 공유는 기기/브라우저가 지원할 때 표시됩니다. 카카오 개발자 키는 필요하지 않습니다.

---

# TEST PLAY — 베타 버전

메인에서 테스트 썸네일 선택 → 테스트 시작 → 질문 선택 → 결과 화면 → 링크 복사까지 동작하는 초기 버전입니다.

## 실행

1. Node.js 20 이상 설치
2. 이 폴더에서 터미널 열기
3. `npm install`
4. `npm run dev` 실행 후 표시되는 주소 접속 (보통 http://localhost:5173)
5. 배포 파일은 `npm run build` 실행 후 `dist/` 폴더에서 확인

> 이 사이트는 React + Vite 정적 웹 앱입니다. HTML 파일을 더블클릭하는 방식이 아니라 개발 서버를 실행해야 합니다.
> 직접 공유 링크를 외부에서 열려면 실제 웹 호스팅에 배포해야 합니다. 호스팅에서는 SPA 라우팅(`/test/...`)을 지원하도록 설정하세요.

## 🟢 직접 수정해도 되는 파일

- `src/content/site.js` : 사이트 이름, 인스타그램 주소
- `src/content/tests/hello-beta.js` : '안녕하세요' 예/아니오 테스트 질문과 결과
- `src/content/tests/*.js` : 새 테스트를 추가할 때 같은 형식의 새 JS 파일 생성
- `public/images/` : 테스트 썸네일·결과 이미지 넣기

새 테스트는 파일만 추가하면 자동 등록됩니다. 별도로 목록 파일을 수정할 필요 없습니다.
`published: false`를 넣으면 파일을 지우지 않고 메인 화면에서 숨길 수 있습니다.
기존 테스트 두 개(`office-persona.js`, `weekend-mode.js`)는 삭제하지 않고 숨겨뒀습니다.

### 이미지 교체

`public/images/new-thumbnail.png` 파일을 넣고 테스트 데이터에 `thumbnail: '/images/new-thumbnail.png'` 추가.
결과 유형에서는 `image: '/images/my-result.png'`를 추가하면 이모지 대신 결과 이미지가 표시됩니다.

## 🔒 평소 수정할 필요 없는 영역

- `src/main.jsx`: 화면 전환, 진행, 결과 링크, SNS 기능
- `src/core/engine.js`: 결과 점수 계산과 검증
- `src/content/tests/index.js`: 테스트 파일 자동 검색
- `src/style.css`: 공통 스타일

## 공유 및 인스타그램 연결

- **모바일 결과 공유:** 기본 공유 기능을 지원하는 모바일 브라우저에서 `결과 공유하기` 버튼이 나타납니다. 카카오톡 등 설치된 앱을 사용자가 선택할 수 있습니다. 지원하지 않는 기기에서는 버튼이 나타나지 않습니다.
- **링크 복사:** PC와 모바일 모두 표시됩니다. 선택한 결과 유형이 URL에 포함되어, 공유된 주소를 열면 같은 결과가 보입니다.
- **인스타그램:** 결과 페이지 맨 아래에 인스타그램 아이콘과 `인스타그램 바로가기` 영역을 항상 표시합니다. 계정 주소가 없는 동안은 `준비 중` 표시이며 클릭되지 않습니다. 나중에 `src/content/site.js`의 `instagramUrl`에 전체 인스타그램 주소를 넣으면 활성화됩니다. 인스타그램으로 결과를 공유하는 기능은 아닙니다.
- **카카오톡 전용 SDK:** 사용하지 않습니다. 별도 키와 등록이 필요 없습니다.

## 테스트 흐름

홈 → '안녕하세요' 썸네일 선택 → 시작하기 → '예' 또는 '아니오' → 각각 다른 결과 → 모바일 공유 또는 링크 복사/다시하기/다른 테스트/인스타그램 영역.

이 베타는 별도 DB, 방문자 통계, 광고, 관리자 화면은 포함하지 않습니다.
