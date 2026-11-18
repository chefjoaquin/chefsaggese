// Genera las carátulas del programa (1080x1350) con Playwright.
// Uso: node tools/caratulas.cjs
const { chromium } = require('playwright');
const path = require('path');
const out = path.join(__dirname, '..', 'curso', 'caratulas');

const mods = [
  ['00', 'Bienvenida', 'Sin plan B'],
  ['01', 'La industria', 'por dentro'],
  ['02', 'Papeles', 'y presupuesto'],
  ['03', 'Tu CV', 'y tu portfolio'],
  ['04', 'Tu primer', 'barco'],
  ['05', 'Entrevista', 'y trial'],
  ['06', 'La galley', 'cocinar a bordo'],
  ['07', 'La cabeza', 'sobrevivir y crecer'],
  ['08', 'Chef privado', 'en tierra'],
  ['B', 'Inglés', 'de galley'],
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,500&family=Inter:wght@400;600;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:var(--w);height:var(--h);background:#0b0b0c;color:#f4efe6;font-family:Inter,sans-serif;overflow:hidden;position:relative}
.bg{position:absolute;inset:0;background:
 radial-gradient(ellipse 90% 60% at 80% 110%, rgba(201,162,77,.28), transparent 60%),
 radial-gradient(ellipse 70% 50% at 0% 0%, rgba(201,162,77,.10), transparent 60%)}
.waves{position:absolute;left:0;bottom:0;width:100%;height:42%;opacity:.35}
.frame{position:absolute;inset:44px;border:1.5px solid rgba(201,162,77,.55)}
.top{position:absolute;top:92px;left:96px;right:96px;display:flex;justify-content:space-between;font-size:22px;letter-spacing:.32em;text-transform:uppercase;color:#c9a24d;font-weight:600}
.num{position:absolute;left:84px;top:var(--numtop);font-family:'Playfair Display',serif;font-weight:800;font-size:var(--numsize);line-height:1;color:transparent;-webkit-text-stroke:2px rgba(201,162,77,.8)}
.title{position:absolute;left:96px;right:96px;bottom:var(--tbottom)}
.t1{font-family:'Playfair Display',serif;font-weight:800;font-size:var(--t1);line-height:1.02;color:#f4efe6}
.t2{font-family:'Playfair Display',serif;font-style:italic;font-weight:500;font-size:var(--t2);color:#c9a24d;margin-top:10px}
.rule{width:120px;height:3px;background:#c9a24d;margin:34px 0 24px}
.foot{font-size:22px;letter-spacing:.28em;text-transform:uppercase;color:rgba(244,239,230,.75)}
`;
const waves = `<svg class="waves" viewBox="0 0 1080 560" preserveAspectRatio="none">${
  Array.from({length:9},(_,i)=>`<path d="M0 ${120+i*50} C 270 ${80+i*50}, 540 ${160+i*50}, 1080 ${100+i*50}" stroke="#c9a24d" stroke-width="1.2" fill="none" opacity="${0.9-i*0.08}"/>`).join('')}</svg>`;

function page({w,h,num,t1,t2,top,foot,numsize,numtop,t1size,t2size,tbottom}) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  :root{--w:${w}px;--h:${h}px;--numsize:${numsize}px;--numtop:${numtop}px;--t1:${t1size}px;--t2:${t2size}px;--tbottom:${tbottom}px}</style></head>
  <body><div class="bg"></div>${waves}<div class="frame"></div>
  <div class="top"><span>${top[0]}</span><span>${top[1]}</span></div>
  ${num?`<div class="num">${num}</div>`:''}
  <div class="title"><div class="t1">${t1}</div><div class="t2">${t2}</div><div class="rule"></div><div class="foot">${foot}</div></div>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const shot = async (html, w, h, file) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, file) });
  };
  // Portada del programa
  await shot(page({w:1080,h:1350,num:'',t1:'De la cocina<br>al yate',t2:'El playbook para trabajar en superyates',
    top:['Chef Joaquín','Programa'],foot:'Joaquín Saggese · Yacht &amp; Private Chef',numsize:0,numtop:0,t1size:132,t2size:46,tbottom:150}),1080,1350,'portada.png');
  // Banner horizontal (Hotmart / web)
  await shot(page({w:1920,h:1080,num:'',t1:'De la cocina al yate',t2:'El playbook para trabajar en superyates de lujo',
    top:['Chef Joaquín','Programa online'],foot:'Joaquín Saggese · Yacht &amp; Private Chef',numsize:0,numtop:0,t1size:140,t2size:52,tbottom:140}),1920,1080,'banner.png');
  for (const [n,a,b] of mods) {
    await shot(page({w:1080,h:1350,num:n,t1:a,t2:b,top:['De la cocina al yate', n==='B'?'Bonus':'Módulo '+n],
      foot:'Chef Joaquín',numsize:n==='B'?420:380,numtop:150,t1size:118,t2size:58,tbottom:150}),1080,1350,`modulo-${n}.png`);
  }
  await browser.close();
  console.log('ok');
})();
