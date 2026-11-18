/** 🟢 사용자 설정 영역: 이 파일만 수정해도 사이트명과 링크를 변경할 수 있습니다. */
export const SITE = {
  name: 'TEST PLAY',
  tagline: '가볍게 즐기는 별별 테스트',
  footer: '가볍게 즐기는 별별 테스트 모음집',
  instagramUrl: '', // 🟢 예: 'https://www.instagram.com/계정명/' (비워두면 결과 화면에 '준비 중' 표시)
};

// 🟢 테스트가 늘어나면 아래 카테고리가 자동 노출됩니다. 지금은 테스트 목록만 표시합니다.
export const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'personality', label: '성격' },
  { id: 'love', label: '연애' },
  { id: 'relationship', label: '인간관계' },
  { id: 'fun', label: '기타' },
];
