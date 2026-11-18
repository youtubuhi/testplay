/** 🔒 시스템 영역: 질문 점수를 집계하고 최종 결과를 계산합니다. */
export function calculateResult(test, answerIndexes) {
  if (test.scoring) {
    const { dimensions, outcomeMap } = test.scoring;
    const tallies = Object.fromEntries(dimensions.map(dim => [dim, { a: 0, b: 0 }]));
    test.questions.forEach((question, index) => {
      const option = question.options[answerIndexes[index]];
      Object.entries(option?.signals || {}).forEach(([dimension, choice]) => { tallies[dimension][choice] += 1; });
    });
    const combination = dimensions.map(dim => tallies[dim].a >= tallies[dim].b ? 'a' : 'b').join('-');
    return outcomeMap[combination];
  }
  // 기존 콘텐츠 점수 방식 호환
  const scores = Object.fromEntries(Object.keys(test.results).map(key => [key, 0]));
  test.questions.forEach((question, index) => {
    const option = question.options[answerIndexes[index]];
    if (!option) return;
    Object.entries(option.scores || {}).forEach(([key, point]) => {
      if (!(key in scores)) throw new Error(`알 수 없는 결과 유형: ${key}`);
      scores[key] += point;
    });
  });
  return Object.keys(scores).reduce((winner, key) => scores[key] > scores[winner] ? key : winner);
}

/** 🔒 콘텐츠 입력 검사 */
export function validateTest(test) {
  const errors = [];
  if (!test.id || !/^[a-z0-9-]+$/.test(test.id)) errors.push('id는 영문 소문자, 숫자, - 만 사용');
  if (!test.title || !Array.isArray(test.questions) || !test.questions.length) errors.push('제목과 질문이 필요함');
  if (!test.results || !Object.keys(test.results).length) errors.push('결과 유형이 필요함');
  (test.questions || []).forEach((q, i) => {
    if (!q.text || !Array.isArray(q.options) || q.options.length < 2) errors.push(`${i+1}번 질문: 문장과 선택지 2개 이상 필요`);
    (q.options || []).forEach((option, j) => {
      Object.keys(option.scores || {}).forEach(key => {
        if (!test.results?.[key]) errors.push(`${i+1}번 질문 ${j+1}번 선택지: '${key}' 결과 유형 없음`);
      });
      if (test.scoring) Object.entries(option.signals || {}).forEach(([dim, choice]) => {
        if (!test.scoring.dimensions.includes(dim) || !['a', 'b'].includes(choice)) errors.push(`${i+1}번 질문: 계산 설정 오류`);
      });
    });
  });
  if (test.scoring) {
    if (new Set(test.scoring.dimensions).size !== test.scoring.dimensions.length) errors.push('계산 기준 중복');
    for (const key of Object.values(test.scoring.outcomeMap)) if (!test.results[key]) errors.push(`결과 연결 누락: ${key}`);
    if (Object.keys(test.scoring.outcomeMap).length !== 2 ** test.scoring.dimensions.length) errors.push('결과 조합 개수 확인 필요');
  }
  if (errors.length) throw new Error(`[${test.id || 'unknown'}] ${errors.join(' / ')}`);
}
