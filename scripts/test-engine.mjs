import assert from 'node:assert/strict';
import devil from '../src/content/tests/devil-score.js';
import emoji from '../src/content/tests/emoji-me.js';
import {calculateResult,scoreSummary,validateTest} from '../src/core/engine.js';
let n=0;function walk(t,a,check){if(a.length===t.questions.length){check(a);n++;return;}for(let i=0;i<t.questions[a.length].options.length;i++)walk(t,[...a,i],check);}
walk(devil,[],a=>{const total=a.reduce((s,i,j)=>s+devil.questions[j].options[i][1],0);const expected=Object.entries(devil.results).find(([k,r])=>total>=r.min&&total<=r.max)?.[0];assert.ok(expected);assert.equal(calculateResult(devil,a),expected);assert.equal(scoreSummary(devil,a).total,total);});console.log('악마 답변 조합:',n);n=0;
walk(emoji,[],a=>{const tally=emoji.scoring.dimensions.map(d=>{let v=0;emoji.questions.forEach((q,i)=>{const signal=q.options[a[i]].signals[d];if(signal)v+=signal==='a'?1:-1;});return v>=0?'a':'b';}).join('-');assert.equal(calculateResult(emoji,a),emoji.scoring.outcomeMap[tally]);});console.log('이모지 답변 조합:',n);
const third={id:'third-check',title:'검증',questions:[{text:'질문',options:[{text:'A',scores:{a:1}},{text:'B',scores:{b:1}}]}],results:{a:{title:'A'},b:{title:'B'}}};validateTest(third);assert.equal(calculateResult(third,[1]),'b');console.log('유형 분류형 검증 완료');
