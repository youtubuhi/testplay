/**
 * 🔒 자동 등록: 이 폴더에 새 .js 테스트를 만들기만 하면 목록에 나타납니다.
 * 🟢 테스트 공개 여부는 각 파일의 published: false 로 조절합니다.
 */
const modules = import.meta.glob(['./*.js', '!./index.js'], { eager: true });
export const TESTS = Object.entries(modules)
  .map(([filename, module]) => ({ filename, test: module.default }))
  .filter(({ test }) => Boolean(test))
  .sort((a, b) => a.filename.localeCompare(b.filename))
  .map(({ test }) => test);
