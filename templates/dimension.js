// 🟢 복사하여 src/content/tests/새-ID.js 에 저장하세요.
export default {
  id:'new-dimension',title:'새 테스트',subtitle:'한 줄 소개',category:'personality',published:false,emoji:'✨',
  createdAt:'2026-11-24',keywords:['검색어'],resultHeading:'나의 유형',descriptionHeading:'상세 설명',
  scoring:{mode:'dimension',dimensions:['x','y'],outcomeMap:{'a-a':'aa','a-b':'ab','b-a':'ba','b-b':'bb'}},
  questions:[
    {text:'첫 성향 질문',options:[{text:'A',signals:{x:'a'}},{text:'B',signals:{x:'b'}}]},
    {text:'둘째 성향 질문',options:[{text:'A',signals:{y:'a'}},{text:'B',signals:{y:'b'}}]},
  ],
  results:{aa:{title:'AA',emoji:'🙂'},ab:{title:'AB',emoji:'😎'},ba:{title:'BA',emoji:'😺'},bb:{title:'BB',emoji:'✨'}},
};
