import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Copy, Instagram, Link2, RotateCcw, Share2, X } from 'lucide-react';
import { SITE } from './content/site.js';
import { TESTS } from './content/tests/index.js';
import { calculateResult, validateTest } from './core/engine.js';
import { createResultImage, downloadResultImage } from './core/result-image.js';
import './style.css';

/** 🔒 공통 시스템: 콘텐츠 파일은 src/content/tests/ 에서 관리하세요. */
TESTS.forEach(validateTest);
if (new Set(TESTS.map(t => t.id)).size !== TESTS.length) throw new Error('테스트 ID가 중복되었습니다.');
const PUBLISHED = TESTS.filter(t => t.published !== false);

// 🔒 GitHub Pages 저장소 경로(/testplay/)를 포함한 이동/이미지 주소
const BASE_PATH = import.meta.env.BASE_URL;
function pagePath(relative = '') { return `${BASE_PATH}${relative.replace(/^\//, '')}`; }
function imagePath(path) { return path?.startsWith('/') ? pagePath(path) : path; }
function readRoute() {
  const path = location.pathname.startsWith(BASE_PATH) ? location.pathname.slice(BASE_PATH.length) : location.pathname.replace(/^\//, '');
  const match = path.match(/^test\/([a-z0-9-]+)\/?$/);
  return match ? { page: 'test', id: match[1] } : { page: 'home' };
}
function readResult(test) {
  const key = new URLSearchParams(location.search).get('result');
  return key && Object.prototype.hasOwnProperty.call(test.results, key) ? key : null;
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [toast, setToast] = useState('');
  const canNativeShare = typeof navigator.share === 'function' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const current = PUBLISHED.find(t => t.id === route.id);
  // 공유된 결과 URL로 직접 들어올 때도 결과 페이지가 열립니다.
  const sharedResultKey = current ? readResult(current) : null;
  const calculatedKey = finished && current ? calculateResult(current, answers) : null;
  const resultKey = sharedResultKey || calculatedKey;
  const result = resultKey && current ? current.results[resultKey] : null;
  const baseUrl = current ? `${location.origin}${pagePath(`test/${current.id}`)}` : '';
  // 친구에게는 결과가 아니라 테스트 시작 주소를 공유합니다.
  const testUrl = baseUrl;

  useEffect(() => {
    const onBack = () => { setRoute(readRoute()); setStep(-1); setAnswers([]); setFinished(false); };
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, []);
  function navigate(url) {
    history.pushState(null, '', url);
    setRoute(readRoute()); setStep(-1); setAnswers([]); setFinished(false);
    window.scrollTo(0, 0);
  }
  function restart() { navigate(pagePath(`test/${current.id}`)); }
  function notice(message) { setToast(message); setTimeout(() => setToast(''), 2700); }
  async function copyLink() {
    try { await navigator.clipboard.writeText(testUrl); notice('테스트 링크를 복사했어요!'); }
    catch { notice('주소창에서 링크를 복사해 주세요.'); }
  }
  async function copyResultImage() {
    if (!current || !result) return;
    // 클립보드 권한은 사용자 클릭 순간에 요청해야 하므로 이미지 생성 Promise를 바로 전달합니다.
    const imagePromise = createResultImage(current, result, SITE.name);
    try {
      if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': imagePromise })]);
          notice('결과 이미지를 복사했어요! 채팅창에 붙여넣어 보세요.');
          return;
        } catch (error) {
          // 브라우저에서 PNG 클립보드를 막은 경우 파일 저장으로 대체합니다.
          console.info('이미지 클립보드 미지원, 다운로드로 전환:', error);
        }
      }
      const blob = await imagePromise;
      downloadResultImage(blob, `${current.id}-${resultKey}.png`);
      notice('이미지 복사를 지원하지 않아 PNG로 저장했어요.');
    } catch (error) {
      console.error('결과 이미지 생성 실패:', error);
      notice('이미지 만들기에 실패했어요. 다른 브라우저에서 시도해 주세요.');
    }
  }
  async function shareResult() {
    // 모바일에서는 휴대폰 기본 공유 메뉴 사용 (카카오톡 등 설치된 앱 선택 가능).
    if (!canNativeShare) { await copyLink(); return; }
    try {
      await navigator.share({
        title: current.title,
        text: '너는 어떤 결과 나오는지 해봐! ✨',
        url: testUrl,
      });
    } catch (error) {
      // 사용자가 공유창을 닫았을 경우는 오류가 아닙니다.
      if (error?.name !== 'AbortError') await copyLink();
    }
  }
  function choose(index) {
    const next = [...answers]; next[step] = index; setAnswers(next);
    if (step === current.questions.length - 1) setFinished(true);
    else setStep(step + 1);
  }
  return <div className="app">
    <header className="site-header"><div className="container header-inner">
      <button className="brand" onClick={() => navigate(pagePath())} aria-label="TEST PLAY 홈">{SITE.name}<span>✳</span></button>
      {SITE.instagramUrl && <a className="instagram" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="공식 인스타그램"><Instagram size={23}/></a>}
    </div></header>
    {route.page === 'home' ? <main className="container home">
      <p className="home-caption">{SITE.tagline} <span>✦</span></p>
      <div className="test-grid">{PUBLISHED.map(test => <button className="test-card" key={test.id} onClick={() => navigate(pagePath(`test/${test.id}`))} aria-label={`${test.title} 테스트 시작`}>
        <div className={`thumbnail ${test.theme || 'lilac'}`}>{test.thumbnail ? <img src={imagePath(test.thumbnail)} alt=""/> : <span>{test.emoji || '✨'}</span>}</div>
        <div className="card-title">{test.title}</div>
      </button>)}</div>
    </main> : current ? <main className="container player">
      <button className="back" onClick={() => navigate(pagePath())}><ArrowLeft size={16}/> 전체 테스트</button>
      {result ? <section className="panel result-panel">
        <div className="result-hero" style={{backgroundColor: result.color || undefined}}>
          <h1>{result.title}</h1>
          <p className="result-lead">이거 제 이모지양 🤨</p>
          <div className="result-image">{result.image ? <img src={imagePath(result.image)} alt={result.title}/> : <span role="img" aria-label={result.title}>{result.emoji || '✨'}</span>}</div>
          <h2>{result.subtitle}</h2>
        </div>
        <div className="result-copy"><h3>이런 사람입니다 💬</h3><p className="result-description">{result.description}</p>
        {result.traits?.length > 0 && <ul className="traits">{result.traits.map((t,i) => <li key={i}>{t}</li>)}</ul>}</div>
        <div className="action-list">
          <button className="share-btn" onClick={copyResultImage}><Copy size={19}/> 결과 이미지 복사하기</button>
          {canNativeShare && <button className="secondary-btn" onClick={shareResult}><Share2 size={18}/> 테스트 공유하기</button>}
          <button className="secondary-btn" onClick={copyLink}><Link2 size={18}/> 테스트 링크 복사</button>
          <button className="ghost-btn" onClick={restart}><RotateCcw size={17}/> 다시 테스트하기</button>
          <button className="ghost-btn" onClick={() => navigate(pagePath())}>다른 테스트 보기 <ArrowRight size={17}/></button></div>
        <div className="result-instagram">
          {SITE.instagramUrl
            ? <a className="instagram-link" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={20}/> 인스타그램 바로가기 <ArrowRight size={16}/></a>
            : <div className="instagram-link is-placeholder" aria-label="인스타그램 링크 준비 중"><Instagram size={20}/> 인스타그램 바로가기 <span className="instagram-soon">준비 중</span></div>}
        </div>
      </section> : step < 0 ? <section className="panel intro">
        <div className={`intro-image ${current.theme || 'lilac'}`}>{current.thumbnail ? <img src={imagePath(current.thumbnail)} alt=""/> : <span>{current.emoji || '✨'}</span>}</div>
        <h1>{current.title}</h1><p>{current.subtitle}</p>
        <button className="primary-btn" onClick={() => setStep(0)}>시작하기 <ArrowRight size={19}/></button>
      </section> : <section className="panel question-panel">
        <div className="progress-label">Q{step + 1} <span>{step + 1} / {current.questions.length}</span></div>
        <div className="progress"><div style={{width:`${(step+1)/current.questions.length*100}%`}}/></div>
        <h1>{current.questions[step].text}</h1>
        <div className="options">{current.questions[step].options.map((option,i)=><button key={i} onClick={()=>choose(i)}>{option.text}<ArrowRight size={19}/></button>)}</div>
        <button className="ghost-btn prev" onClick={()=>setStep(step-1)}><ArrowLeft size={16}/> 이전으로</button>
      </section>}
    </main> : <main className="container not-found"><h1>테스트를 찾을 수 없어요.</h1><button className="primary-btn" onClick={() => navigate(pagePath())}>홈으로</button></main>}
    <footer><div className="container"><strong>{SITE.name} ✳</strong><p>{SITE.footer}</p>{SITE.instagramUrl && <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={16}/> Instagram</a>}</div></footer>
    {toast && <div className="toast"><span>{toast}</span><button onClick={()=>setToast('')} aria-label="닫기"><X size={15}/></button></div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
