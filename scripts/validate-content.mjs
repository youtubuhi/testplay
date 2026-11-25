import { readdir, access } from 'node:fs/promises';
import { validateTest } from '../src/core/engine.js';
const ids = new Set();
for(const f of await readdir(new URL('../src/content/tests/',import.meta.url))){
 if(!f.endsWith('.js')||f==='index.js')continue;
 const {default:t}=await import(`../src/content/tests/${f}`);
 if(!t)throw Error(`${f}: 기본 데이터 없음`);
 validateTest(t);
 if(ids.has(t.id))throw Error(`${f}: ID 중복`);ids.add(t.id);
 const imgs=[t.thumbnail,t.shareImage,...Object.values(t.results).map(r=>r.image),...t.questions.flatMap(q=>[q.image,...q.options.map(o=>o.image||o[2])])];
 for(const img of imgs.filter(Boolean)){
  if(/^https?:\/\//.test(img))continue;
  try{await access(new URL('../public/'+img.replace(/^\//,''),import.meta.url));}catch{throw Error(`${f}: 이미지 파일 없음 ${img}`);}
 }
 console.log(`OK ${f}`);
}
