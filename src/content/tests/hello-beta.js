/**
 * 🟢 수정 가능: 베타 테스트. 질문/선택지/결과를 여기서 바꿀 수 있습니다.
 * 새 테스트는 같은 폴더에 .js 파일을 추가하면 자동 등록됩니다.
 */
export default {
  id: 'hello-beta',
  title: '안녕하세요',
  subtitle: '첫 번째 베타 테스트',
  category: 'fun',
  thumbnail: '/images/hello-beta.svg',
  theme: 'peach',
  questions: [
    { text: '안녕하세요', options: [
      { text: '예', scores: { yes: 1 } },
      { text: '아니오', scores: { no: 1 } },
    ] },
  ],
  results: {
    yes: { emoji: '💗', title: '반가워요!', subtitle: '예를 선택했어요', description: '안녕하세요! 첫 번째 베타 테스트가 정상적으로 끝났어요.', traits: ['예'] },
    no: { emoji: '🌟', title: '그래도 반가워요!', subtitle: '아니오를 선택했어요', description: '아니오를 선택했네요! 결과 화면까지 정상적으로 도착했어요.', traits: ['아니오'] },
  },
};
