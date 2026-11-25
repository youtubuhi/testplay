// 🟢 복사하여 src/content/tests/새-ID.js 에 저장하세요.
export default {
  id: 'new-score', title: '새 테스트', subtitle: '한 줄 소개',
  category: 'fun', keywords: ['검색어'], createdAt: '2026-11-24',
  published: false, featured: false, emoji: '✨', theme: 'lilac', accent: '#7451c0',
  // thumbnail: '/images/new-score/cover.png',
  // shareImage: '/images/new-score/cover.png',
  resultHeading: '결과', descriptionHeading: '상세 설명', showScore: true, scoreLabel: '점수',
  scoring: {mode: 'score'},
  questions: [{text:'질문 1',options:[['선택지 A',0],['선택지 B',1],['선택지 C',2]]}],
  results: {
    low:{min:0,max:1,title:'낮은 점수',emoji:'🙂',description:'설명',traits:['특징']},
    high:{min:2,max:2,title:'높은 점수',emoji:'😎',description:'설명'},
  },
};
