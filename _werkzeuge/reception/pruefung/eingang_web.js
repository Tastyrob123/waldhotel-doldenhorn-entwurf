// La Réception · Waldhotel Doldenhorn: was der Eingang des Studios konnte (E15) und jetzt in La Réception steckt, Zeile für Zeile bedient.
//   node eingang_web.js <url-des-werkzeugs> <url-des-hausservers> [chromium|webkit|firefox] [breite] [höhe]
//   z. B. node eingang_web.js /_werkzeuge/reception/ http://localhost:8939 webkit 390 844
// Läuft gegen die Probe-Kopie mit Wegwerf-Daten: La Réception (RECEPTION_KI=0, RECEPTION_HAUS=<hausserver>) und der Hausserver der Kopie (serve.py),
// dessen _dienste/anfragen.jsonl die Ablage des Anfrage-Fensters ist. Ergebnis: pruefung/lauf/eingang-<motor>-<breite>.json, Fotos in pruefung/belege/.
const path = require('path'), fs = require('fs');
const pw = require(path.join(process.env.HOME, 'Desktop/Apps & Tools/Tasty Website Builder/node_modules/playwright'));
const [, , BASIS, HAUS, MOTOR = 'chromium', BREITE = '1440', HOEHE] = process.argv;
const W = +BREITE, H = +(HOEHE || (W < 700 ? 844 : 900)), HANDY = W < 700;
const OUT = path.join(__dirname, 'lauf'), BEL = path.join(__dirname, 'belege'); fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(BEL, { recursive: true });
const ORIGIN = new URL(BASIS).origin;
const res = [], fehlerSeite = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ok = (b, was) => { if (!b) throw new Error(was); };
const zeig = r => console.log(`${r.stand === 'grün' ? 'ok  ' : 'ROT '} ${r.name} · ${String(r.info || '').slice(0, 160)}`);
const haus = async (methode, d) => { const r = await fetch(HAUS + '/api/anfragen', { method: methode, headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }); return r.json(); };
const NAME = 'Eingang QA ' + MOTOR + ' ' + W;

(async () => {
  const br = await pw[MOTOR].launch();
  const ctx = await br.newContext({ viewport: { width: W, height: H }, locale: 'de-CH', hasTouch: HANDY, isMobile: HANDY && MOTOR === 'chromium' });
  await ctx.addInitScript(() => { try { localStorage.setItem('reception-name', 'QA Prüfer'); localStorage.setItem('rundgang-dh-reception', '1'); if (!sessionStorage.getItem('__qa_dh')) { sessionStorage.setItem('__qa_dh', '1'); sessionStorage.removeItem('re-dh-abt'); } } catch (e) { /* */ } });
  const p = await ctx.newPage(); p.setDefaultTimeout(15000);
  p.on('pageerror', e => fehlerSeite.push('JS: ' + String(e).slice(0, 200)));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|status of 4\d\d/.test(m.text())) fehlerSeite.push('Konsole: ' + m.text().slice(0, 200)); });
  p.on('dialog', d => d.dismiss().catch(() => {}));
  const t = async s => (await p.locator(s).first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  const gehe = async ans => { await p.goto('about:blank'); await p.goto(BASIS + '#' + ans, { waitUntil: 'load' }); await p.waitForSelector('#ansicht > *', { timeout: 30000 }); await sleep(900); };
  const klick = async sel => { const l = p.locator(sel).first(); await l.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {}); await l.click(); };
  const foto = async name => { await p.screenshot({ path: path.join(BEL, `${name}-${MOTOR}-${W}x${H}.jpg`), quality: 70, type: 'jpeg' }); };
  const api = was => p.evaluate(async w => (await fetch('api/' + w)).json(), was);
  const schritt = async (name, fn) => {
    const f0 = fehlerSeite.length;
    try { const info = await fn(); const neu = fehlerSeite.slice(f0); res.push({ name, stand: neu.length ? 'rot' : 'grün', info: (neu.length ? 'Fehler: ' + neu.join(' | ') + ' · ' : '') + (info || '') }); }
    catch (e) { res.push({ name, stand: 'rot', info: String(e.message || e).split('\n')[0].slice(0, 300) }); await p.screenshot({ path: path.join(BEL, 'fehler-eingang-' + name.split(' ')[0] + '-' + MOTOR + '-' + W + '.jpg'), type: 'jpeg', quality: 60 }).catch(() => {}); }
    zeig(res[res.length - 1]);
  };
  const karte = name => p.locator('.re-liste .re-a', { hasText: name });

  // ---------- Website → La Réception
  await schritt('D01 Anfrage-Fenster der Website (Spa-Termin) landet im Eingang, mit Abteilung, Seite, Nachricht, Stand «Neu»', async () => {
    await gehe('start'); const vor = (await api('ueberblick')).anfragen_gesamt;
    // genau so, wie assets/js/anfrage.js «Termin im Spa» schickt, über den Weg der Website (POST /api/anfragen derselben Adresse)
    const r = await p.evaluate(async d => (await fetch('/api/anfragen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })).json(),
      { an: 'spa@doldenhorn.ch', anliegen: 'Termin im Spa: Massagen · Klassische Massage', datum: 'Samstag, 24. Oktober 2026, 15:00 Uhr', personen: '1',
        nachricht: 'Behandlung: Klassische Massage (25 min, CHF 75)\nTag: Samstag\nUhrzeit: 15:00 (Wunschzeit)\nName: ' + NAME, name: NAME, kontakt: 'eingang-qa@example.com', seite: '/spa.html', sprache: 'de', website: '' });
    ok(r.ok, 'Website nimmt die Anfrage nicht: ' + JSON.stringify(r));
    const s0 = (await api('anfragen')).anfragen.find(x => x.name === NAME);   // vor dem Öffnen: der Eingang wählt die neueste neue Anfrage selbst und macht sie damit gelesen
    ok(s0 && s0.status === 'neu' && s0.abteilung === 'Spa' && s0.web && s0.seite_name === 'Spa' && /Uhrzeit: 15:00/.test(s0.nachricht), 'Daten: ' + JSON.stringify(s0 || {}).slice(0, 200));
    await gehe('eingang'); const u = await api('ueberblick'); ok(u.anfragen_gesamt === vor + 1, `Eingang ${vor} → ${u.anfragen_gesamt}`);
    const k = karte(NAME); ok(await k.count() === 1, 'Karte fehlt'); const kt = (await k.innerText()).replace(/\s+/g, ' ');
    ok(/Website/i.test(kt) && /Probe/i.test(kt), 'Karte: ' + kt);
    await k.evaluate(e => e.scrollIntoView({ block: 'center' })); await k.click(); await sleep(900); await p.waitForSelector('#detail .re-d__n h2');
    const d = await t('#detail .re-d'); ok(/Spa/i.test(d) && /spa@doldenhorn\.ch/i.test(d) && /Anfrage-Fenster der Website, Seite Spa/i.test(d) && /Die Nachricht über die Website/i.test(d), 'Detail: ' + d.slice(0, 200));
    await p.waitForSelector('#brief', { timeout: 30000 }); await foto('web-anfrage'); return 'Karte: ' + kt.slice(0, 80);
  });
  await schritt('D02 Öffnen heisst gelesen, auch an der Website (alter Eingang)', async () => {
    await sleep(800); const l = (await haus('GET')).anfragen; const x = l.find(a => a.name === NAME); ok(x && x.stand === 'gelesen', 'Stand an der Website: ' + (x && x.stand)); return 'Website: ' + x.stand;
  });
  await schritt('D03 Brief: Absender ist die Abteilung, Unterschrift mit der Abteilung (Probe-Brief)', async () => {
    const von = await p.evaluate(() => [...document.querySelectorAll('#brief .gs--an')].map(e => e.innerText).join(' | ').replace(/\s+/g, ' ')); ok(/spa@doldenhorn\.ch/.test(von), 'Von: ' + von); const b = await t('#brief'); ok(/Spa · Waldhotel Doldenhorn/.test(b), 'Unterschrift fehlt: ' + b.slice(-160)); return von.slice(0, 80);
  });
  await schritt('D04 Erledigt hier → erledigt an der Website; Wieder offen → offen', async () => {
    await klick('#detail [data-akt="erledigt"]'); await sleep(1200); let x = (await haus('GET')).anfragen.find(a => a.name === NAME); ok(x.stand === 'erledigt', 'nach Erledigt: ' + x.stand);
    await klick('#detail [data-akt="offen"]'); await sleep(1200); x = (await haus('GET')).anfragen.find(a => a.name === NAME); ok(x.stand === 'gelesen', 'nach Wieder offen: ' + x.stand); return 'erledigt → gelesen';
  });
  await schritt('D05 Stand im alten Eingang gesetzt → La Réception übernimmt ihn', async () => {
    const x = (await haus('GET')).anfragen.find(a => a.name === NAME); await haus('POST', { tun: 'erledigt', id: x.id }); await sleep(4300);
    await gehe('eingang'); const s = (await api('anfragen')).anfragen.find(a => a.name === NAME); ok(s && s.status === 'erledigt', 'La Réception: ' + (s && s.status));
    await haus('POST', { tun: 'offen', id: x.id }); await sleep(4300); await gehe('eingang'); const s2 = (await api('anfragen')).anfragen.find(a => a.name === NAME); ok(s2.status === 'gelesen', 'zurück: ' + s2.status); return 'erledigt, wieder gelesen';
  });

  // ---------- Abteilungen und Auswahl
  await schritt('D06 Abteilungen: Zahl offener je Abteilung stimmt, Auswahl filtert, bleibt beim Neuladen', async () => {
    await gehe('eingang'); const l = (await api('anfragen')).anfragen;
    const ab = a => a.abteilung || ({ spa: 'Spa', feier: 'Event', tagung: 'Event' }[a.art] || 'Rezeption');
    const aus = [];
    for (const n of ['alle', 'Rezeption', 'Spa', 'Event', 'Personal']) {
      const soll = l.filter(a => a.status !== 'erledigt' && (n === 'alle' || ab(a) === n)).length;
      const b = p.locator(`.re-abt [data-abt="${n}"]`); const ist = +(await b.locator('i').innerText()); ok(ist === soll, `${n}: ${ist} statt ${soll}`);
      await b.evaluate(e => e.scrollIntoView({ block: 'center' })); await b.click(); await sleep(600);
      const karten = await p.locator('.re-liste .re-a').count(); const sollK = l.filter(a => n === 'alle' || ab(a) === n).length;   // Auswahl «Alle» (Stand) ist eingestellt
      ok(karten === sollK, `${n}: ${karten} Karten statt ${sollK}`); aus.push(`${n} ${ist}/${karten}`);
    }
    await p.locator('.re-abt [data-abt="Event"]').click(); await sleep(500); await p.reload({ waitUntil: 'load' }); await p.waitForSelector('.re-abt'); await sleep(700);
    ok(await p.locator('.re-abt [data-abt="Event"][aria-pressed="true"]').count() === 1, 'Abteilung nach Neuladen vergessen');
    await foto('abteilung-event'); await p.locator('.re-abt [data-abt="alle"]').click(); await sleep(400); return aus.join(', ') + ', gemerkt';
  });
  await schritt('D07 Auswahl «Neu» zeigt nur neue, Zahl stimmt', async () => {
    await gehe('eingang'); await klick('.re-filter [data-filter="neu"]'); await sleep(600); const z = +(await t('.re-filter [data-filter="neu"] i')); const k = await p.locator('.re-liste .re-a').count();
    const u = await api('ueberblick'); ok(z === k && z === u.anfragen_neu, `Neu: Zahl ${z}, Karten ${k}, Server ${u.anfragen_neu}`); await klick('.re-filter [data-filter="alle"]'); return `${z} neu`;
  });

  // ---------- Löschen und keine Anfrage geht verloren
  await schritt('D08 Prüfseite zeigt die Verbindung zur Website (Anfrage-Fenster)', async () => {
    const z = await p.evaluate(async () => (await fetch('api/zustand')).json()); const w = z.punkte.find(x => x.gruppe === 'Website'); ok(w && w.stand === 'gut', 'Zustand Website: ' + JSON.stringify(w));
    return w.text;
  });
  await schritt('D09 Löschen hier löscht auch an der Website (Wunsch des Gastes)', async () => {
    await gehe('eingang'); const k = karte(NAME); await k.evaluate(e => e.scrollIntoView({ block: 'center' })); await k.click(); await sleep(700);
    await klick('#detail [data-akt="weg"]'); await p.waitForSelector('#fenster:not([hidden]) #f-los'); await p.locator('#f-los').click(); await sleep(1200);
    ok(await karte(NAME).count() === 0, 'Karte noch da'); const x = (await haus('GET')).anfragen.find(a => a.name === NAME); ok(!x, 'an der Website noch da');
    await sleep(4300); await gehe('eingang'); ok(await karte(NAME).count() === 0, 'nach dem Abgleich wieder da'); return 'hier und an der Website weg, kommt nicht wieder';
  });
  await schritt('D10 Alte Adresse /studio/eingang.html führt zum Eingang von La Réception (mit ?an=), ?bleiben zeigt den alten', async () => {
    await p.goto(ORIGIN + '/studio/eingang.html?an=event', { waitUntil: 'load' }); await p.waitForURL(/reception\/#eingang/, { timeout: 10000 }); await p.waitForSelector('.re-abt'); await sleep(600);
    ok(await p.locator('.re-abt [data-abt="Event"][aria-pressed="true"]').count() === 1, 'Abteilung aus ?an= nicht gewählt');
    await p.goto(ORIGIN + '/studio/eingang.html?bleiben', { waitUntil: 'load' }); await sleep(2500); ok(/studio\/eingang\.html/.test(p.url()) && await p.locator('.eg-kopf').count() === 1, 'alter Eingang fehlt');
    await p.goto(BASIS + '#eingang', { waitUntil: 'load' }); await p.waitForSelector('.re-abt'); await p.locator('.re-abt [data-abt="alle"]').click(); return 'weiter mit Abteilung, Rückfall da';
  });
  await schritt('D11 Kein seitliches Verrutschen im Eingang mit Abteilungen', async () => {
    await gehe('eingang'); const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); ok(o <= 0, o + ' px zu breit'); await foto('eingang-abteilungen'); return 'Überlauf ' + o;
  });

  const gruen = res.filter(r => r.stand === 'grün').length;
  fs.writeFileSync(path.join(OUT, `eingang-${MOTOR}-${W}.json`), JSON.stringify(res, null, 1));
  console.log(`${gruen} grün, ${res.length - gruen} rot von ${res.length} · ${MOTOR} ${W}×${H}`);
  await br.close();
})();
