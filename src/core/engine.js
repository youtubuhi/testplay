/** 🔒 시스템 영역: 질문, 선택지 점수를 집계하고 최고 점수 결과를 고릅니다. */
export function calculateResult(test, answerIndexes) {
  const scores = Object.fromEntries(Object.keys(test.results).map(key => [key, 0]));
  test.questions.forEach((question, index) => {
    const option = question.options[answerIndexes[index]];
    if (!option) return;
    Object.entries(option.scores || {}).forEach(([key, point]) => {
      if (!(key in scores)) throw new Error(`알 수 없는 결과 유형: ${key}`);
      scores[key] += point;
    });
  });
  // 동점은 results에 먼저 정의한 유형 우선
  return Object.keys(scores).reduce((winner, key) => scores[key] > scores[winner] ? key : winner);
}

/** 🔒 시스템 영역: 콘텐츠에서 발생하기 쉬운 오타를 개발 중 바로 발견합니다. */
export function validateTest(test) {
  const errors = [];
  if (!test.id || !/^[a-z0-9-]+$/.test(test.id)) errors.push('id는 영문 소문자, 숫자, - 만 사용');
  if (!test.title || !Array.isArray(test.questions) || !test.questions.length) errors.push('제목과 질문이 필요함');
  if (!test.results || !Object.keys(test.results).length) errors.push('결과 유형이 필요함');
  (test.questions || []).forEach((q, i) => {
    if (!q.text || !Array.isArray(q.options) || q.options.length < 2) errors.push(`${i+1}번 질문: 문장과 선택지 2개 이상 필요`);
    (q.options || []).forEach((option, j) => Object.keys(option.scores || {}).forEach(key => {
      if (!test.results?.[key]) errors.push(`${i+1}번 질문 ${j+1}번 선택지: '${key}' 결과 유형 없음`);
    }));
  });
  if (errors.length) throw new Error(`[${test.id || 'unknown'}] ${errors.join(' / ')}`);
}
