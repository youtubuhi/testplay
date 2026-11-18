/**
 * 🔒 공통 시스템 — 테스트 결과를 PNG 이미지로 만듭니다.
 * 결과 제목·이모지·설명 등은 src/content/tests/ 파일에서 수정하세요.
 */
function rounded(ctx, x, y, width, height, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

function wrap(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  for (const char of [...String(text || '')]) {
    if (char === '\n') { lines.push(line); line = ''; continue; }
    if (line && ctx.measureText(line + char).width > maxWidth) {
      lines.push(line.trimEnd());
      line = char === ' ' ? '' : char;
    } else line += char;
  }
  if (line) lines.push(line.trimEnd());
  return lines;
}

function printLines(ctx, lines, x, y, lineHeight) {
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
}

export async function createResultImage(test, result, siteName) {
  if (document.fonts?.ready) await document.fonts.ready;
  const width = 900;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('이미지 생성 기능을 사용할 수 없습니다.');

  const koreanFont = "'Noto Sans KR', sans-serif";
  ctx.font = `500 29px ${koreanFont}`;
  const descriptionLines = wrap(ctx, result.description, 738);
  ctx.font = `500 27px ${koreanFont}`;
  const traitLines = (result.traits || []).map(t => wrap(ctx, t, 695));
  const traitsHeight = traitLines.reduce((total, lines) => total + lines.length * 43 + 18, 0);
  const height = Math.max(1210, 735 + 109 + descriptionLines.length * 47 + 34 + 31 + traitsHeight + 130);
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = '#fffefa';
  ctx.fillRect(0, 0, width, height);
  rounded(ctx, 34, 34, 832, 666, 35, result.color || '#ffe4ba');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#554249';
  ctx.font = `800 66px ${koreanFont}`;
  ctx.fillText(result.title, width / 2, 88);
  ctx.fillStyle = '#866a7d';
  ctx.font = `700 30px ${koreanFont}`;
  ctx.fillText('이거 제 이모지양 🤨', width / 2, 194);
  ctx.font = "245px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
  ctx.fillText(result.emoji || '✨', width / 2, 263);
  ctx.fillStyle = '#554249';
  ctx.font = `800 35px ${koreanFont}`;
  const subtitleLines = wrap(ctx, result.subtitle, 716);
  printLines(ctx, subtitleLines, width / 2, 570, 49);

  const contentY = 735;
  rounded(ctx, 34, contentY, 832, height - contentY - 110, 30, '#fff7fa');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#514052';
  ctx.font = `800 35px ${koreanFont}`;
  ctx.fillText('이런 사람입니다 💬', 82, contentY + 43);
  ctx.font = `500 29px ${koreanFont}`;
  ctx.fillStyle = '#6f6072';
  printLines(ctx, descriptionLines, 82, contentY + 109, 47);
  let traitY = contentY + 109 + descriptionLines.length * 47 + 34;
  ctx.strokeStyle = '#ebdce8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(82, traitY);
  ctx.lineTo(818, traitY);
  ctx.stroke();
  traitY += 31;
  ctx.font = `500 27px ${koreanFont}`;
  for (const lines of traitLines) {
    ctx.fillStyle = '#cf819c';
    ctx.fillText('✓', 82, traitY);
    ctx.fillStyle = '#65596a';
    printLines(ctx, lines, 122, traitY, 43);
    traitY += lines.length * 43 + 18;
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#987e9a';
  ctx.font = `800 25px ${koreanFont}`;
  ctx.fillText(`${siteName} ✳  ·  ${test.title}`, width / 2, height - 68);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('이미지를 PNG로 만들지 못했습니다.');
  return blob;
}

export function downloadResultImage(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
