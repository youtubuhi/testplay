import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Instagram, Link2, RotateCcw, Share2, X } from 'lucide-react';
import { SITE } from './content/site.js';
import { TESTS } from './content/tests/index.js';
import { calculateResult, validateTest } from './core/engine.js';
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
  const resultUrl = resultKey ? `${baseUrl}?result=${encodeURIComponent(resultKey)}` : baseUrl;

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
    try { await navigator.clipboard.writeText(resultUrl); notice('링크를 복사했어요!'); }
    catch { notice('주소창에서 링크를 복사해 주세요.'); }
  }
  async function shareResult() {
    // 모바일에서는 휴대폰 기본 공유 메뉴 사용 (카카오톡 등 설치된 앱 선택 가능).
    if (!canNativeShare) { await copyLink(); return; }
    try {
      await navigator.share({
        title: result ? `${current.title} - ${result.title}` : current.title,
        text: result ? `내 결과는 '${result.title}'! 너도 해봐 ✨` : '이 테스트 한번 해봐 ✨',
        url: resultUrl,
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
        <span className="overline">YOUR RESULT ✦</span>
        <div className={`result-image ${current.theme || 'lilac'}`}>{result.image ? <img src={imagePath(result.image)} alt={result.title}/> : <span>{result.emoji || '✨'}</span>}</div>
        <p className="result-lead">나의 테스트 결과는?</p><h1>{result.title}</h1>
        <h2>{result.subtitle}</h2><p className="result-description">{result.description}</p>
        {result.traits?.length > 0 && <div className="traits">{result.traits.map(t => <span key={t}>#{t.replaceAll(' ', '')}</span>)}</div>}
        <div className="action-list">
          {canNativeShare && <button className="share-btn" onClick={shareResult}><Share2 size={19}/> 결과 공유하기</button>}
          <button className="secondary-btn" onClick={copyLink}><Link2 size={18}/> 링크 복사</button>
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
