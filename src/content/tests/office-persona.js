/**
 * 🟢 수정 가능: 테스트 콘텐츠 파일
 * 아래 id는 링크 주소에 사용되므로 공개 후에는 변경하지 않는 것이 좋습니다.
 * 각 선택지 scores의 키는 results의 키와 같아야 합니다.
 */
export default {
  published: false, // 🟢 기존 예시 데이터 보존, 베타 목록에서만 숨김
  id: 'office-persona',
  title: '나의 사회생활 생존 유형은?',
  subtitle: '회사든 모임이든, 나는 어떤 사람일까?',
  category: 'personality',
  emoji: '🪩',
  theme: 'lilac',
  minutes: 2,
  featured: true,
  questions: [
    {
      text: '처음 가는 모임에 도착했는데 아는 사람이 없다면?',
      options: [
        { text: '아무나 붙잡고 말을 걸어본다', scores: { explorer: 2 } },
        { text: '조용히 분위기를 파악한다', scores: { observer: 2 } },
      ],
    },
    {
      text: '갑자기 단체 일정이 변경됐다!',
      options: [
        { text: '오히려 좋아. 새로운 계획을 세운다', scores: { explorer: 2 } },
        { text: '일단 바뀐 이유부터 확인한다', scores: { observer: 2 } },
      ],
    },
    {
      text: '누군가 내 의견에 반대할 때 나는?',
      options: [
        { text: '재밌네? 왜 그렇게 생각하는지 물어본다', scores: { explorer: 2 } },
        { text: '상대 논리를 정리하고 차분히 답한다', scores: { observer: 2 } },
      ],
    },
    {
      text: '주말 약속이 갑자기 취소됐다면?',
      options: [
        { text: '다른 재미있는 일을 찾아 나선다', scores: { explorer: 2 } },
        { text: '뜻밖의 혼자만의 시간을 즐긴다', scores: { observer: 2 } },
      ],
    },
  ],
  results: {
    explorer: {
      emoji: '🎉',
      title: '즉흥형 분위기 메이커',
      subtitle: '어디서든 재미를 발견하는 사람',
      description: '새로운 상황에서도 주저하지 않고 일단 부딪혀 보는 편! 예상 밖의 순간에서 기회를 찾는 재능이 있어요.',
      traits: ['적응력 만렙', '새로운 경험 선호', '유머 장착'],
    },
    observer: {
      emoji: '🧩',
      title: '침착한 상황 분석가',
      subtitle: '관찰하고 판단한 뒤 움직이는 사람',
      description: '상황의 맥락을 재빠르게 읽고 적절한 선택을 내리는 편! 조용해 보여도 머릿속은 늘 바쁘게 돌아가요.',
      traits: ['상황 판단 빠름', '안정감 있는 선택', '혼자서도 잘 놂'],
    },
  },
};
