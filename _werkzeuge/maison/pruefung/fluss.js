// La Maison · Flüssigkeit (Regel 55): Waldhotel Doldenhorn · Chromium, Prozessor 4× und 6× gedrosselt, Rechner 1440 × 900 und Handy 390 × 844.
// Scrollt die ganze Seite in Rad-Schritten, misst Bildabstände (requestAnimationFrame), Layoutverschiebung und Ladegewicht.
// node _werkzeuge/maison/pruefung/fluss.js [basis]   (nur messen, wenn `uptime` unter 8 liegt; bricht sonst ab). Dazu am Rechner: Zeiger über alle sechs Schilder (Bildwechsel).
const { chromium } = require('/Users/robertreff/Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright');
const fs = require('fs'), path = require('path');
const URL_ = (process.argv[2] || '').replace(/\/$/, '') + '/_werkzeuge/maison/';
(async () => {
  const last = require('os').loadavg()[0];
  if (last >= 8 && !process.env.TROTZDEM) { console.log('Rechnerlast ' + last.toFixed(1) + ' (über 8): nicht gemessen'); process.exit(2); }
  const b = await chromium.launch(); const aus = [];
  for (const [w, h, handy] of [[1440, 900, false], [390, 844, true]]) for (const dross of [4, 6]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, ...(handy ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
    const p = await c.newPage(); const cdp = await c.newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: dross });
    let bytes = 0, anfragen = 0; p.on('response', async r => { anfragen++; try { const l = r.headers()['content-length']; if (l) bytes += +l; } catch (e) { } });
    await p.addInitScript(() => { window.__cls = 0; new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true }); });
    await p.goto(URL_, { waitUntil: 'load' }); await p.waitForTimeout(3000);
    await p.evaluate(() => { window.__t = []; let v = performance.now(); const f = n => { window.__t.push(n - v); v = n; window.__raf = requestAnimationFrame(f); }; window.__raf = requestAnimationFrame(f); });
    if (!handy) { for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const k = await p.$('.ws >> nth=' + i); const bb = await k.boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 6 }); await p.waitForTimeout(120); } }
    const hoehe = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < hoehe; y += 120) { await p.mouse.wheel(0, 120); await p.waitForTimeout(16); }
    await p.waitForTimeout(800);
    const t = await p.evaluate(() => { cancelAnimationFrame(window.__raf); return window.__t.slice(2); });
    const s = t.slice().sort((a, b) => a - b), q = x => s[Math.min(s.length - 1, Math.floor(s.length * x))];
    const r = { groesse: w + 'x' + h, drossel: dross + '×', bilder: t.length, p50: +q(.5).toFixed(1), p95: +q(.95).toFixed(1), ueber33: t.filter(x => x > 33).length, laengstes: +Math.max(...t).toFixed(0), cls: +(await p.evaluate(() => window.__cls)).toFixed(4), laden_mb: +(bytes / 1048576).toFixed(2), anfragen };
    console.log(JSON.stringify(r)); aus.push(r); await c.close();
  }
  await b.close();
  fs.writeFileSync(path.join(__dirname, 'fluss-ergebnis.json'), JSON.stringify({ zeit: new Date().toISOString(), last: require('os').loadavg(), werte: aus }, null, 1));
})();
