// Prüf-Chat La Réception Doldenhorn: Flüssigkeit gedrosselt (Regel 55). Vorbild Carlton pruefung/fluss.js (nur gelesen), erweitert um Netz-Drossel,
// Verschieben beim Laden (CLS), Handy und Tippen im Brief. Bricht ab, wenn die Rechnerlast über 8 liegt.
//   node fluss.js <url-des-werkzeugs> <ausgabe.json> [drossel …]
const path = require('path'), fs = require('fs'), os = require('os');
const pw = require(path.join(process.env.HOME, 'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));
const [, , B, AUS, ...D] = process.argv; const DROSSEL = (D.length ? D : ['1', '4', '6']).map(Number);
const last = os.loadavg()[0];
if (last >= 8) { console.log(`ABBRUCH: Rechnerlast ${last.toFixed(1)} (über 8)`); process.exit(3); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const br = await pw.chromium.launch(); const aus = [];
  for (const geraet of [{ n: 'Laptop', w: 1440, h: 900, m: false }, { n: 'Handy', w: 390, h: 844, m: true }]) {
    for (const dr of DROSSEL) {
      const ctx = await br.newContext({ viewport: { width: geraet.w, height: geraet.h }, locale: 'de-CH', isMobile: geraet.m, hasTouch: geraet.m });
      await ctx.addInitScript(() => { try { localStorage.setItem('reception-name', 'Prüf Chat'); localStorage.setItem('rundgang-dh-reception', '1'); } catch (e) { } window.__cls = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch (e) { } });
      const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: dr });
      await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 2 * 1024 * 1024, uploadThroughput: 750 * 1024 });   // ~16 Mbit/s, 150 ms
      const messe = async (wie) => {
        await p.evaluate(() => { window.__f = []; let t0 = performance.now(); const lauf = t => { window.__f.push(t - t0); t0 = t; window.__rid = requestAnimationFrame(lauf); }; window.__rid = requestAnimationFrame(lauf); });
        await wie();
        const f = await p.evaluate(() => { cancelAnimationFrame(window.__rid); return window.__f.slice(2); });
        const s = [...f].sort((a, b) => a - b); return { med: Math.round((s[Math.floor(s.length / 2)] || 0) * 10) / 10, p95: Math.round((s[Math.floor(s.length * 0.95)] || 0) * 10) / 10, lang: f.filter(x => x > 50).length, n: f.length };
      };
      for (const a of ['start', 'eingang', 'gefragt', 'wissen']) {
        await p.goto('about:blank'); const t0 = Date.now(); await p.goto(B + '#' + a, { waitUntil: 'load' }); await p.waitForSelector('#ansicht > *', { timeout: 60000 });
        await p.waitForFunction(() => !document.documentElement.classList.contains('auftakt') && !document.body.classList.contains('auftakt'), null, { timeout: 8000 }).catch(() => {});
        const bereit = Date.now() - t0; await sleep(1500); const cls = await p.evaluate(() => Math.round(window.__cls * 1000) / 1000);
        const r = await messe(async () => { await p.mouse.move(geraet.w / 2, geraet.h / 2); for (let i = 0; i < 20; i++) { await p.mouse.wheel(0, 180); await sleep(70); } for (let i = 0; i < 20; i++) { await p.mouse.wheel(0, -180); await sleep(70); } await sleep(300); });
        aus.push({ geraet: geraet.n, drossel: dr, ansicht: a, bereit_ms: bereit, cls, scroll: r });
        console.log(`${geraet.n} ${dr}× ${a.padEnd(8)} bereit ${bereit} ms · CLS ${cls} · Rollen Bildzeit Median ${r.med} ms, p95 ${r.p95} ms, ${r.lang} über 50 ms`);
      }
      // Wechsel zum Eingang (Rand bzw. Bereiche-Knopf) und Tippen im Brief
      await p.goto(B + '#start'); await p.waitForSelector('#ansicht > *'); await sleep(1500);
      const t1 = Date.now();
      if (geraet.m) { await p.evaluate(() => { location.hash = 'eingang'; }); } else await p.click('#rand [data-gehe="eingang"]');
      await p.waitForSelector('.re-liste .re-a'); const wechsel = Date.now() - t1;
      await p.waitForSelector('#brief', { timeout: 30000 }).catch(() => {}); await sleep(800);
      let tippen = null;
      const absatz = p.locator('#brief [data-b^="p"]').first();
      if (await absatz.count()) {
        await absatz.evaluate(e => e.scrollIntoView({ block: 'center' })); await absatz.dblclick(); await sleep(300);
        tippen = await p.evaluate(async () => { const el = document.activeElement; const z = []; for (let i = 0; i < 12; i++) { const t0 = performance.now(); document.execCommand('insertText', false, 'x'); await new Promise(r => requestAnimationFrame(() => r())); z.push(performance.now() - t0); } z.sort((a, b) => a - b); return { med: Math.round(z[6]), max: Math.round(z[11]), feld: el && el.tagName }; });
        await p.keyboard.press('Escape');
      }
      aus.push({ geraet: geraet.n, drossel: dr, ansicht: 'wechsel+tippen', wechsel_ms: wechsel, tippen });
      console.log(`${geraet.n} ${dr}× Wechsel zum Eingang ${wechsel} ms · Tippen im Brief bis ins Bild ${tippen ? tippen.med + ' ms (Median), höchstens ' + tippen.max + ' ms' : 'nicht gemessen'}`);
      await ctx.close();
    }
  }
  fs.writeFileSync(AUS, JSON.stringify({ zeit: new Date().toISOString(), last_start: last, last_ende: os.loadavg()[0], messungen: aus }, null, 1));
  console.log('Rechnerlast Start', last.toFixed(1), 'Ende', os.loadavg()[0].toFixed(1));
  await br.close();
})().catch(e => { console.log('ABBRUCH', e.message); process.exit(1); });
