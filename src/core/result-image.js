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

export async function createResultImage(test, result, siteName, score, imagePath = x => x) {
  if (document.fonts?.ready) await document.fonts.ready;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('이미지 생성 기능을 사용할 수 없습니다.');
  const width = 900, font = "'Noto Sans KR', sans-serif";
  const fontAt = (size, weight=700) => {ctx.font = `${weight} ${size}px ${font}`;};
  const linesAt = (text,size,max=740) => {fontAt(size);return wrap(ctx,text,max);};
  const titles = linesAt(result.title,58), lead = linesAt(test.resultHeading,30), sub = linesAt(result.subtitle,35);
  const descriptions = linesAt(result.description,29);
  const traits = [...(result.traits || []), ...Object.entries(result.compatibility || {}).map(([k,v])=>`${k}: ${v}`)].map(t=>linesAt(t,27,690));
  const showScore = test.showScore && score;
  const showImage = test.showResultImage !== false;
  const heroHeight = 100 + titles.length*75 + lead.length*42 + (showImage?285:0) + sub.length*49 + (showScore?100:0);
  const hasBody = descriptions.length || traits.length;
  const heading = hasBody ? linesAt(test.descriptionHeading,35) : [];
  const bodyHeight = hasBody ? 90 + heading.length*49 + descriptions.length*47 + traits.reduce((n,l)=>n+l.length*43+16,0) : 0;
  const height = heroHeight + bodyHeight + 150;
  canvas.width=width; canvas.height=height;
  ctx.fillStyle='#fffefa';ctx.fillRect(0,0,width,height);ctx.textBaseline='top';ctx.textAlign='center';
  rounded(ctx,34,34,832,heroHeight,35,result.color || '#ffe4ba');
  let y=75;
  function draw(lines,size,step,color,x=450){fontAt(size);ctx.fillStyle=color;printLines(ctx,lines,x,y,step);y+=lines.length*step;}
  draw(titles,58,75,'#554249');draw(lead,30,42,'#866a7d');
  let image = null;
  if(showImage && result.image) { try { image = await new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=reject;img.src=imagePath(result.image);}); } catch {} }
  if(showImage && image) {const ratio=Math.min(330/image.width,260/image.height);ctx.drawImage(image,450-image.width*ratio/2,y+(260-image.height*ratio)/2,image.width*ratio,image.height*ratio);}
  else if(showImage) {ctx.font="210px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";ctx.fillText(result.emoji || '✨',450,y+12);}
  if(showImage)y+=285;draw(sub,35,49,'#554249');
  if(showScore){y+=10;draw([`${test.scoreLabel || '점수'} ${score.percent}%`],32,45,'#554249');rounded(ctx,100,y,700,18,9,'#e4d7ed');if(score.percent>0)rounded(ctx,100,y,700*score.percent/100,18,9,test.accent || '#9364ac');}
  if(hasBody){y=heroHeight+65;rounded(ctx,34,y,832,bodyHeight,30,'#fff7fa');y+=35;ctx.textAlign='left';draw(heading,35,49,'#514052',82);draw(descriptions,29,47,'#6f6072',82);y+=16;for(const lines of traits){draw(lines,27,43,'#65596a',100);y+=16;}}
  ctx.textAlign='center';y=height-55;draw(linesAt(`${siteName} ✳ · ${test.title}`,25,810),25,32,'#987e9a');
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw new Error('이미지를 PNG로 만들지 못했습니다.');return blob;
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
