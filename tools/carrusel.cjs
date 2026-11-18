// Genera carruseles de Instagram (1080x1350) desde un JSON.
// Uso: node tools/carrusel.cjs contenido/carruseles/<nombre>.json
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const src = process.argv[2];
const data = JSON.parse(fs.readFileSync(src, 'utf8'));
const outDir = src.replace(/\.json$/, '');
fs.mkdirSync(outDir, { recursive: true });

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,500&family=Inter:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;font-family:Inter,sans-serif;font-variant-numeric:lining-nums;overflow:hidden;position:relative}
.dark{background:#0b0b0c;color:#f4efe6}.light{background:#f4efe6;color:#0b0b0c}
.glow{position:absolute;inset:0;background:radial-gradient(ellipse 90% 55% at 85% 105%,rgba(201,162,77,.25),transparent 60%)}
.frame{position:absolute;inset:40px;border:1.5px solid rgba(201,162,77,.55)}
.top{position:absolute;top:84px;left:96px;right:96px;display:flex;justify-content:space-between;font-size:22px;letter-spacing:.3em;text-transform:uppercase;color:#c9a24d;font-weight:600}
.body{position:absolute;left:96px;right:96px;top:220px;bottom:200px;display:flex;flex-direction:column;justify-content:center}
.cover h1{font-family:'Playfair Display',serif;font-weight:800;font-size:112px;line-height:1.02}
.cover .sub{font-family:'Playfair Display',serif;font-style:italic;font-size:48px;color:#c9a24d;margin-top:28px;line-height:1.2}
.kicker{font-size:24px;letter-spacing:.28em;text-transform:uppercase;color:#c9a24d;font-weight:700;margin-bottom:26px}
h2{font-family:'Playfair Display',serif;font-weight:800;font-size:84px;line-height:1.05;margin-bottom:34px}
.big{font-variant-numeric:lining-nums;font-family:'Playfair Display',serif;font-weight:800;font-size:150px;line-height:1;color:#c9a24d;margin-bottom:20px}
p{font-size:40px;line-height:1.4}
.light p{color:#2a2825}.dark p{color:#d9d3c7}
.src{position:absolute;left:96px;right:96px;bottom:140px;font-size:20px;letter-spacing:.06em;opacity:.6}
.foot{position:absolute;left:96px;right:96px;bottom:84px;display:flex;justify-content:space-between;font-size:22px;letter-spacing:.24em;text-transform:uppercase;opacity:.7}
.swipe{color:#c9a24d}
.cta .pill{display:inline-block;border:2px solid #c9a24d;color:#c9a24d;padding:22px 40px;font-size:44px;font-weight:700;letter-spacing:.08em;margin-top:30px}
`;
function slide(s, i, n) {
  const theme = s.type === 'cover' || s.type === 'cta' || s.theme === 'dark' ? 'dark' : 'light';
  let inner = '';
  if (s.type === 'cover') inner = `<div class="cover"><h1>${s.title}</h1>${s.sub ? `<div class="sub">${s.sub}</div>` : ''}</div>`;
  else if (s.type === 'stat') inner = `${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}<div class="big">${s.big}</div><p>${s.text}</p>`;
  else if (s.type === 'cta') inner = `<div class="cta"><h2>${s.title}</h2><p>${s.text}</p>${s.pill ? `<div class="pill">${s.pill}</div>` : ''}</div>`;
  else inner = `${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}<h2>${s.title}</h2>${s.text ? `<p>${s.text}</p>` : ''}`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body class="${theme}">
  ${theme === 'dark' ? '<div class="glow"></div><div class="frame"></div>' : ''}
  <div class="top"><span>${data.brand || 'Chef Joaquín'}</span><span>${i + 1}/${n}</span></div>
  <div class="body">${inner}</div>
  ${s.src ? `<div class="src">${s.src}</div>` : ''}
  <div class="foot"><span>@joaquinsaggese</span><span class="swipe">${i < n - 1 ? 'Deslizá →' : ''}</span></div>
  </body></html>`;
}
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const n = data.slides.length;
  for (let i = 0; i < n; i++) {
    await p.setContent(slide(data.slides[i], i, n), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(outDir, String(i + 1).padStart(2, '0') + '.png') });
  }
  await b.close();
  console.log(outDir, n);
})();
