// La Réception · Waldhotel Doldenhorn: die nachgestellte Online-Fassung bedienen (online_probe.py muss laufen, Hausserver der Probe-Kopie auf :8939).
//   node online_bedienen.js [http://localhost:8938] [chromium|webkit|firefox]
const path = require('path');
const pw = require(path.join(process.env.HOME, 'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));
const O = process.argv[2] || '', MOTOR = process.argv[3] || 'chromium', B = O + '/werkzeuge/reception/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let gruen = 0, rot = 0;
const ok = (b, was) => { if (!b) throw new Error(was); };
(async () => {
  const br = await pw[MOTOR].launch(); const ctx = await br.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-CH' });
  await ctx.addInitScript(() => { try { localStorage.setItem('reception-name', 'QA Online'); localStorage.setItem('rundgang-dh-reception', '1'); } catch (e) { /* */ } });
  const p = await ctx.newPage(); p.setDefaultTimeout(20000); const fehler = []; p.on('pageerror', e => fehler.push(String(e)));
  let gedruckt = 0; await p.exposeFunction('__gedruckt', () => { gedruckt++; }); await ctx.addInitScript(() => { window.print = () => window.__gedruckt && window.__gedruckt(); });
  const api = (w, d) => p.evaluate(async ([w, d]) => { const r = await fetch('api/' + w, d ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) } : {}); let j = {}; try { j = await r.json(); } catch (e) { /* */ } return { s: r.status, j }; }, [w, d]);
  const schritt = async (n, fn) => { const f0 = fehler.length; try { const i = await fn(); ok(fehler.length === f0, 'Skriptfehler: ' + fehler.slice(f0).join(' | ')); gruen++; console.log('ok  ', n, '·', i || ''); } catch (e) { rot++; console.log('ROT ', n, '·', String(e.message).split('\n')[0].slice(0, 220)); } };
  await schritt('O1 Oberfläche unter /werkzeuge/reception/ lädt (statik), Übersicht mit Zahlen über die Umleitung', async () => { await p.goto(B, { waitUntil: 'load' }); await p.waitForSelector('.lage'); const u = await api('ueberblick'); ok(u.s === 200 && typeof u.j.anfragen_neu === 'number', 'ueberblick ' + u.s); return `neu ${u.j.anfragen_neu}, offen ${u.j.anfragen_offen}, Fragen ${u.j.fragen_gesamt}, Speicher ${u.j.speicher}`; });
  await schritt('O2 Auch die lokale Adresse /_werkzeuge/reception/ führt online zur Oberfläche', async () => { const r = await p.evaluate(async o => (await fetch(o + '/_werkzeuge/reception/')).status, O); ok(r === 200, 'Status ' + r); return '200'; });
  await schritt('O3 Website-Anfrage über /api/anfragen landet im Eingang (Blob «reception»), Abteilung Event', async () => {
    const r = await p.evaluate(async () => (await fetch('/api/anfragen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ an: 'event@doldenhorn.ch', anliegen: 'Online QA Seminar', datum: '', personen: '12', nachricht: 'Seminar für 12', name: 'Online QA', kontakt: 'online-qa@example.com', seite: '/seminare.html', sprache: 'de', website: '' }) })).json());
    ok(r.ok, 'Website nimmt nicht'); await sleep(4500); const l = (await api('anfragen')).j.anfragen; const a = l.find(x => x.name === 'Online QA'); ok(a && a.abteilung === 'Event' && a.art === 'tagung', 'nicht im Eingang: ' + JSON.stringify(a || {}).slice(0, 120)); return a.id; });
  await schritt('O4 Öffnen schreibt den Brief (Probe-Assistent), gelesen auch an der Website', async () => {
    await p.goto('about:blank'); await p.goto(B + '#eingang', { waitUntil: 'load' }); await p.waitForSelector('.re-liste'); await p.locator('.re-liste .re-a', { hasText: 'Online QA' }).click(); await p.waitForSelector('#brief', { timeout: 60000 });
    await sleep(1500); return 'Brief da'; });
  await schritt('O5 Stand an der Website: gelesen (über x-gast-geheim/same-origin wie online)', async () => { const r = await p.evaluate(async () => (await fetch('/api/anfragen')).json()); const x = r.anfragen.find(a => a.name === 'Online QA'); ok(x && x.stand === 'gelesen', 'Stand ' + (x && x.stand)); return x.stand; });
  await schritt('O6 Brief gestalten: Änderung gesichert, nach Neuladen noch da (Blob)', async () => {
    const l = (await api('anfragen')).j.anfragen; const a = l.find(x => x.name === 'Online QA'); const r = await api('anfrage', { id: a.id, betreff: 'Online QA Betreff', entwurf_text: a.entwurf.text + '\n\nOnline QA Zusatz' }); ok(r.s === 200, 'sichern ' + r.s);
    const b = (await api('anfragen')).j.anfragen.find(x => x.id === a.id); ok(/Online QA Zusatz/.test(b.entwurf.text) && b.entwurf.betreff === 'Online QA Betreff', 'nicht gehalten'); return 'gehalten'; });
  await schritt('O7 Als PDF sichern online: Server sagt DRUCK, Oberfläche öffnet das Druckfenster', async () => {
    await p.goto('about:blank'); await p.goto(B + '#eingang', { waitUntil: 'load' }); await p.waitForSelector('.re-liste'); await p.locator('.re-liste .re-a', { hasText: 'Online QA' }).click(); await p.waitForSelector('#brief'); await sleep(800);
    const r = await api('brief_pdf', { id: (await api('anfragen')).j.anfragen.find(x => x.name === 'Online QA').id }); ok(r.s === 501 && /DRUCK/.test(r.j.fehler), 'Antwort ' + r.s);
    const vor = gedruckt; await p.locator('#detail [data-akt="pdf"]').click(); await sleep(1500); ok(gedruckt > vor, 'Druckfenster nicht geöffnet'); return 'Druckfenster'; });
  await schritt('O8 Erledigt online → erledigt an der Website; Löschen online → an der Website weg', async () => {
    const a = (await api('anfragen')).j.anfragen.find(x => x.name === 'Online QA'); await api('anfrage', { id: a.id, status: 'erledigt' });
    let x = (await p.evaluate(async () => (await fetch('/api/anfragen')).json())).anfragen.find(y => y.name === 'Online QA'); ok(x.stand === 'erledigt', 'Stand ' + x.stand);
    const w = await api('weg', { id: a.id }); ok(w.s === 200, 'löschen ' + w.s); x = (await p.evaluate(async () => (await fetch('/api/anfragen')).json())).anfragen.find(y => y.name === 'Online QA'); ok(!x, 'an der Website noch da'); return 'erledigt, gelöscht'; });
  await schritt('O9 Chat online (api/gast.py): Antwort, Frage landet in «Das wurde gefragt» (Monats-Ablage)', async () => {
    const r = await p.evaluate(async () => (await fetch('/api/gast', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Reception-Probe': '1' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'Online QA Frage zum Hallenbad' }], sprache: 'de' }) })).json());
    ok(/Probe-Antwort/.test(r.text || ''), 'Antwort: ' + JSON.stringify(r).slice(0, 120)); await sleep(500); const f = (await api('fragen')).j.fragen; ok(f.some(x => /Online QA Frage/.test(x.frage)), 'Frage fehlt'); return 'gespeichert'; });
  await schritt('O10 Prüfseite online: Zustand mit Speicher, Wissen, Website-Anfragen', async () => { await p.goto(B + 'pruefung.html', { waitUntil: 'load' }); await p.waitForSelector('.z'); const z = await api('zustand'); const w = z.j.punkte.find(x => x.gruppe === 'Website'); ok(w && w.stand === 'gut', 'Website: ' + JSON.stringify(w)); return z.j.punkte.length + ' Punkte'; });
  await schritt('O11 Daten online herunterladen (ZIP)', async () => { const r = await p.evaluate(async () => { const x = await fetch('api/export'); return { s: x.status, t: x.headers.get('content-type'), n: (await x.arrayBuffer()).byteLength }; }); ok(r.s === 200 && /zip/.test(r.t) && r.n > 1000, JSON.stringify(r)); return r.n + ' Byte'; });
  await schritt('O12 Herkunft online: Schreiben ohne eigene Herkunft 403', async () => { const r = await (await fetch(B + 'api/anfrage', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://boese.example' }, body: '{}' })).status; ok(r === 403, 'Status ' + r); return '403'; });
  console.log(`online ${MOTOR}: ${gruen} grün, ${rot} rot von ${gruen + rot}`); await br.close();
})();
