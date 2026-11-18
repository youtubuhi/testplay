/** 🟢 수정 가능: 두 번째 예시 테스트 */
export default {
  published: false, // 🟢 기존 예시 데이터 보존, 베타 목록에서만 숨김
  id: 'weekend-mode',
  title: '내 주말의 진짜 주인은?',
  subtitle: '쉬는 날의 나는 의외로 다르다',
  category: 'fun',
  emoji: '🛋️',
  theme: 'peach',
  minutes: 1,
  questions: [
    {text: '토요일 오전 10시, 눈을 떴다. 첫 생각은?', options: [
      {text: '밖에 나가서 뭐라도 해야지', scores: { outside: 1 }},
      {text: '드디어 아무것도 안 해도 된다', scores: { inside: 1 }},
    ]},
    {text: '친구가 갑자기 나오라고 연락했다면?', options: [
      {text: '재밌는 거면 바로 출발', scores: { outside: 1 }},
      {text: '오늘은 집이랑 이미 약속 있음', scores: { inside: 1 }},
    ]},
    {text: '일요일 저녁, 가장 만족스러운 기억은?', options: [
      {text: '어제 처음 해 본 경험', scores: { outside: 1 }},
      {text: '푹 쉬어서 충전한 기분', scores: { inside: 1 }},
    ]},
  ],
  results: {
    outside: {emoji: '🎡', title: '주말 탐험가', subtitle: '쉬는 날에도 새로운 장면이 필요해', description: '당신에게 주말은 평일에 못 한 경험을 채우는 시간이에요.', traits: ['경험 수집가', '즉흥 환영']},
    inside: {emoji: '🧸', title: '집콕 마스터', subtitle: '아무것도 안 하는 것도 능력', description: '당신에게 주말은 스스로 정한 속도로 시간을 보내는 소중한 기회예요.', traits: ['휴식의 장인', '혼자 놀기 달인']},
  },
};
