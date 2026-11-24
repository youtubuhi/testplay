/** 🔒 시스템: 빌드가 끝날 때 공개 테스트별 SNS 링크 미리보기 HTML을 자동 생성합니다. */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const TESTS_DIR = path.join(ROOT, 'src', 'content', 'tests');
const SITE_URL = 'https://youtubuhi.github.io/testplay/';
const SITE_TITLE = 'TEST PLAY';

const escapeHtml = (text) => String(text ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
function absoluteUrl(value) {
  if (!value) return SITE_URL;
  if (/^https?:\/\//.test(value)) return value;
  return new URL(value.replace(/^\//, ''), SITE_URL).href;
}
function metaTag(property, content) {
  return `<meta property="${escapeHtml(property)}" content="${escapeHtml(content)}">`;
}
function twitterTag(name, content) {
  return `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}">`;
}
function withPreview(html, { title, description, image, url }) {
  const fullTitle = `${title} | ${SITE_TITLE}`;
  const tags = [
    metaTag('og:type', 'website'),
    metaTag('og:site_name', SITE_TITLE),
    metaTag('og:title', fullTitle),
    metaTag('og:description', description),
    metaTag('og:image', image),
    metaTag('og:url', url),
    twitterTag('twitter:card', 'summary_large_image'),
    twitterTag('twitter:title', fullTitle),
    twitterTag('twitter:description', description),
    twitterTag('twitter:image', image),
    `<link rel="canonical" href="${escapeHtml(url)}">`,
  ].join('\n    ');
  return html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)
    .replace('</head>', `    ${tags}\n</head>`);
}

const distHtml = await readFile(path.join(DIST, 'index.html'), 'utf8');
const homeHtml = withPreview(distHtml, {
  title: '가볍게 즐기는 별별 테스트',
  description: 'TEST PLAY에서 나에게 딱 맞는 재미있는 테스트를 찾아보세요.',
  image: absoluteUrl('images/emoji-me-cover.png'), // 🟢 추후 전용 사이트 로고 이미지로 교체 가능
  url: SITE_URL,
});
await writeFile(path.join(DIST, 'index.html'), homeHtml);
await writeFile(path.join(DIST, '404.html'), homeHtml); // React SPA의 예외 경로용

let generated = 0;
for (const filename of await readdir(TESTS_DIR)) {
  if (!filename.endsWith('.js') || filename === 'index.js') continue;
  const moduleUrl = pathToFileURL(path.join(TESTS_DIR, filename)).href;
  const { default: test } = await import(moduleUrl);
  if (!test || test.published === false) continue;
  if (!/^[a-z0-9-]+$/.test(test.id)) throw new Error(`잘못된 테스트 ID: ${test.id}`);
  const output = path.join(DIST, 'test', test.id);
  await mkdir(output, { recursive: true });
  const url = new URL(`test/${test.id}/`, SITE_URL).href;
  const page = withPreview(distHtml, {
    title: test.shareTitle || test.title,
    description: test.shareDescription || test.subtitle || '나에게 맞는 테스트를 시작해 보세요!',
    image: absoluteUrl(test.shareImage || test.thumbnail),
    url,
  });
  await writeFile(path.join(output, 'index.html'), page);
  generated++;
  console.log(`OG ready: ${url}`);
}
console.log(`완료: ${generated}개 공개 테스트의 미리보기 페이지 생성`);
